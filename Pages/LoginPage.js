const totp = require('../Utils/totp');

/**
 * Logs in to Oracle Fusion through the Redwood IDCS sign-in page, including MFA.
 *
 * Flow (verified against the live IDCS page):
 *  1. Optional "Acknowledge" notice -> dismissed.
 *  2. Username + password -> "Next".
 *  3. MFA. IDCS may show the passkey screen first; we click "Try another way" -> "Passcode",
 *     type a TOTP code generated from FUSION_TOTP_SECRET and click "Verify".
 *     An invalid/expired code is retried once with a code from the next 30 s window.
 *  4. Success = the browser has left the IDCS host and is inside Fusion.
 *
 * Any failure throws an Error (message never contains the password, secret or code).
 * The caller (index.js) turns that into a "Failed" notification, so a human is alerted.
 *
 * Env:
 *  FUSION_TOTP_SECRET        Base32 TOTP secret (required when MFA is asked).
 *  FUSION_MFA_MAKE_DEFAULT   "true" ticks "Make this my default method" so Passcode is shown
 *                            first next time (skips the passkey screen). Default: off.
 *
 * @param {object} page - Puppeteer page instance.
 * @param {string} url - Fusion URL to open.
 * @param {string} username - Username for login.
 * @param {string} password - Password for login.
 */

// Selectors (IDCS Redwood sign-in). Ids end in "|input" because they are Oracle JET fields.
const SEL = {
    username: '[id="idcs-signin-basic-signin-form-username|input"]',
    password: '[id="idcs-signin-basic-signin-form-password|input"]',
    next: '#idcs-signin-basic-signin-form-submit',
    // MFA
    passkeyTryAnotherWay: '#idcs-mfa-mfa-auth-try-another-way',     // on the passkey screen
    choosePasscode: '#idcs-mfa-mfa-auth-totp-backup-button',         // in the "Choose how..." list
    passcode: '[id="idcs-mfa-mfa-auth-passcode-input|input"]',
    verify: '#idcs-mfa-mfa-auth-totp-submit-button',
    makeDefault: 'input[name="idcs-mfa-mfa-auth-totp-make-as-default-method"]',
};

const IDCS_HOST = 'identity.oraclecloud.com';
const TIMEOUT = 60000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const onIdcs = (page) => new URL(page.url()).hostname.endsWith(IDCS_HOST);

// Clicks an Oracle JET <oj-button> (the real <button> is inside it) with a real mouse click,
// so focus moves like a person's click and JET fields commit their typed value first.
async function clickOjButton(page, selector) {
    await page.waitForSelector(`${selector} button`, { visible: true, timeout: TIMEOUT });
    await page.click(`${selector} button`);
}

// Waits until an <oj-button> is enabled. JET exposes "disabled" as a property, not reliably as an attribute.
async function waitForEnabled(page, selector, timeout = 30000) {
    await page.waitForFunction((sel) => {
        const oj = document.querySelector(sel);
        const btn = oj && (oj.querySelector('button') || oj);
        return !!btn && oj.disabled !== true && btn.disabled !== true;
    }, { timeout, polling: 250 }, selector);
}

// Waits until the page is in one of the known states and returns its name.
async function waitForState(page, states, timeout = TIMEOUT) {
    const handle = await page.waitForFunction((states, idcsHost) => {
        const visible = (el) => !!el && !!(el.offsetParent || el.getClientRects().length);
        if (!location.hostname.endsWith(idcsHost)) return 'app';
        for (const [name, selector] of Object.entries(states)) {
            if (visible(document.querySelector(selector))) return name;
        }
        return false;
    }, { timeout, polling: 500 }, states, IDCS_HOST);
    return handle.jsonValue();
}

async function login(page, url, username, password) {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Already signed in (Fusion did not redirect to IDCS) -> nothing to do.
    if (!onIdcs(page)) {
        console.log('Login skipped: session already authenticated');
        return;
    }

    // Redwood may present an "Acknowledge" notice before the sign-in form.
    await sleep(1500);
    await page.evaluate(() => {
        const visible = (el) => !!(el.offsetParent || el.getClientRects().length);
        const els = Array.from(document.querySelectorAll('button, oj-button, a[role="button"]'));
        const ack = els.find((e) => visible(e) && (e.innerText || '').trim().toLowerCase() === 'acknowledge');
        if (ack) (ack.querySelector('button') || ack).click();
    });

    // Username + password, then "Next" (an <oj-button>, enabled once both are filled).
    await page.waitForSelector(SEL.username, { visible: true, timeout: TIMEOUT });
    await page.type(SEL.username, username);
    await page.waitForSelector(SEL.password, { visible: true, timeout: TIMEOUT });
    await page.type(SEL.password, password);
    await waitForEnabled(page, SEL.next);
    await clickOjButton(page, SEL.next);
    console.log('Login submitted');

    // What comes next: the app (no MFA), the passkey screen, the method list, or the passcode field.
    let state;
    try {
        state = await waitForState(page, {
            passcode: SEL.passcode,
            chooser: SEL.choosePasscode,
            passkey: SEL.passkeyTryAnotherWay,
        });
    } catch {
        throw new Error('Login failed: after username/password the page showed neither Fusion nor a known MFA screen (check credentials, or the sign-in page changed).');
    }

    if (state !== 'app') {
        await completeMfa(page, state);
    }
    console.log('Login complete');
}

async function completeMfa(page, state) {
    const secret = process.env.FUSION_TOTP_SECRET;
    // Check the secret before touching the MFA page (throws a secret-free message if empty/invalid).
    try {
        totp.generate(secret);
    } catch (err) {
        throw new Error(`MFA failed: FUSION_TOTP_SECRET problem - ${err.message}`);
    }

    // Passkey screen -> "Try another way" -> method list -> "Passcode".
    if (state === 'passkey') {
        await clickOjButton(page, SEL.passkeyTryAnotherWay);
        state = 'chooser';
    }
    if (state === 'chooser') {
        await clickOjButton(page, SEL.choosePasscode);
    }
    await page.waitForSelector(SEL.passcode, { visible: true, timeout: TIMEOUT });

    if (process.env.FUSION_MFA_MAKE_DEFAULT === 'true') {
        await page.$eval(SEL.makeDefault, (el) => { if (!el.checked) el.click(); }).catch(() => {});
    }

    // Try once; if the code is rejected, retry once with a code from the next 30 s window.
    for (let attempt = 1; attempt <= 2; attempt++) {
        const minSeconds = attempt === 1 ? 5 : 31; // 31 forces waiting for a brand-new window
        const { code } = await totp.generateFresh(secret, minSeconds);

        await page.click(SEL.passcode, { clickCount: 3 }); // select any old value so it is replaced
        await page.keyboard.press('Backspace');
        await page.type(SEL.passcode, code);
        await page.keyboard.press('Tab'); // leave the field so JET commits the typed value
        await waitForEnabled(page, SEL.verify, 10000);
        await clickOjButton(page, SEL.verify);
        console.log(`MFA passcode submitted (attempt ${attempt})`);

        // Success = we left IDCS. If we are still on IDCS after 30 s, the code was rejected.
        try {
            await page.waitForFunction((host) => !location.hostname.endsWith(host), { timeout: 30000, polling: 500 }, IDCS_HOST);
            return;
        } catch {
            // Only a visible passcode field means "code rejected"; any other IDCS screen is unexpected.
            const stillOnPasscode = await page.$(SEL.passcode).then((el) => el && el.isVisible());
            if (!stillOnPasscode) {
                throw new Error('MFA failed: unexpected sign-in screen after Verify (the sign-in page may have changed).');
            }
            console.log(`MFA passcode not accepted (attempt ${attempt})`);
        }
    }
    throw new Error('MFA failed: passcode rejected twice (check FUSION_TOTP_SECRET and the server clock).');
}

module.exports = login;

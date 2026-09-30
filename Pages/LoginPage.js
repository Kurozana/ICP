/**
 * Logs in to Oracle Fusion (Redwood IDCS sign-in) using the provided credentials.
 *
 * Redwood changes handled:
 *  - Username/password field ids are UNCHANGED
 *    (idcs-signin-basic-signin-form-username|input / ...-password|input).
 *  - The submit button keeps its id (#idcs-signin-basic-signin-form-submit) but is now an
 *    <oj-button> (Oracle JET web component) labeled "Next", wrapping a native <button>, and is
 *    disabled until credentials are entered -> we wait for it to enable, then click the inner <button>.
 *  - An "Acknowledge" notice may appear before the form -> dismissed if present.
 *
 * @param {object} page - Puppeteer page instance.
 * @param {string} url - URL to navigate to.
 * @param {string} username - Username for login.
 * @param {string} password - Password for login.
 */
async function login(page, url, username, password) {
    await page.goto(url, { waitUntil: 'networkidle2' });

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Redwood may present an "Acknowledge" notice before the sign-in form.
    await sleep(1500);
    await page.evaluate(() => {
        const visible = (el) => !!(el.offsetParent || el.getClientRects().length);
        const els = Array.from(document.querySelectorAll('button, oj-button, a[role="button"]'));
        const ack = els.find(e => visible(e) && (e.innerText || '').trim().toLowerCase() === 'acknowledge');
        if (ack) (ack.querySelector('button') || ack).click();
    });

    // Username (field id unchanged under Redwood)
    await page.waitForSelector('[id="idcs-signin-basic-signin-form-username|input"]', { visible: true, timeout: 60000 });
    await page.type('[id="idcs-signin-basic-signin-form-username|input"]', username);

    // Password (field id unchanged under Redwood)
    await page.waitForSelector('[id="idcs-signin-basic-signin-form-password|input"]', { visible: true, timeout: 60000 });
    await page.type('[id="idcs-signin-basic-signin-form-password|input"]', password);

    // Submit: id still exists but it's now an <oj-button> ("Next"), disabled until valid.
    // Wait for the button, give JET a moment to enable it, then click the inner native <button>.
    await page.waitForSelector('#idcs-signin-basic-signin-form-submit', { visible: true, timeout: 30000 });
    await sleep(1000);
    await page.evaluate(() => {
        const oj = document.querySelector('#idcs-signin-basic-signin-form-submit');
        if (oj) (oj.querySelector('button') || oj).click();
    });

    console.log('Login submitted');
}

module.exports = login;

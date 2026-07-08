/**
 * Logs in to the page using the provided credentials.
 * @param {object} page - Puppeteer page instance.
 * @param {string} url - URL to navigate to.
 * @param {string} username - Username for login.
 * @param {string} password - Password for login.
 */
async function login(page, url, username, password) {
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('[id="idcs-signin-basic-signin-form-username|input"]', { visible: true, timeout: 60000 });
    await page.type('[id="idcs-signin-basic-signin-form-username|input"]', username);

    await page.waitForSelector('[id="idcs-signin-basic-signin-form-password|input"]', { visible: true, timeout: 60000 });
    await page.type('[id="idcs-signin-basic-signin-form-password|input"]', password);

    await page.waitForSelector('#idcs-signin-basic-signin-form-submit', { visible: true, timeout: 60000 });
    await page.click('#idcs-signin-basic-signin-form-submit');

    console.log('Login submitted');
}

module.exports = login;
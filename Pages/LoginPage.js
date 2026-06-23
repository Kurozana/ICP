/**
 * Logs in to the page using the provided credentials.
 * @param {object} page - Puppeteer page instance.
 * @param {string} url - URL to navigate to.
 * @param {string} username - Username for login.
 * @param {string} password - Password for login.
 */
async function login(page, url, username, password) {
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('#idcs-signin-basic-signin-form-username', { visible: true });
    await page.type('#idcs-signin-basic-signin-form-username', username);

    await page.waitForSelector('#idcs-signin-basic-signin-form-password', { visible: true });
    await page.type('#idcs-signin-basic-signin-form-password', password);

    await page.waitForSelector('#idcs-signin-basic-signin-form-submit', { visible: true });
    await page.click('#idcs-signin-basic-signin-form-submit');

    console.log('Login submitted');
}

module.exports = login;
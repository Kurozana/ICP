const AutomationError = require('../Utils/CustomError');

// requestTypes: plan name -> request type function (RequestTypes/index.js)
async function Scenario(res, body, page, browser, username, password, url,
    Login,
    PersonManagement,
    awardCompensation,
    HandleResponse,
    requestTypes,
) {
    // Person Number is required for the automation
    const { personNumber, plan, RequestID } = body;

    console.log(`Starting automation for Person Number: ${personNumber}, Plan: ${plan}, RequestID: ${RequestID}`);

    const missingFields = [];
    if (!personNumber) missingFields.push('Person Number');
    if (!plan) missingFields.push('Plan');
    if (!RequestID) missingFields.push('RequestID');
    if (missingFields.length > 0) {
        await browser.close();
        throw new AutomationError(`Missing ${missingFields.join(', ')}!`, plan, personNumber, RequestID);
    }

    //Login to Oracle Fusion
    await Login(page, url, username, password);

    // Navigate to Person Management page
    await PersonManagement(page, personNumber);

    // Award Compensation
    await awardCompensation(page, browser, body, res, plan, personNumber, RequestID, HandleResponse, requestTypes);

    //Delay
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));

    //Continue
    await page.waitForFunction(() => {
        const buttons = Array.from(document.querySelectorAll('a[role="button"]'));
        return buttons.some(btn => btn.innerText.replace(/\s+/g, '').includes('Continue'));
    });

    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('a[role="button"]'));
        for (let btn of buttons) {
            if (btn.innerText.replace(/\s+/g, '').includes('Continue')) {
                btn.focus();
                btn.click();
                break;
            }
        }
    });

    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));

    //submit
    await page.waitForFunction(() => {
        const buttons = Array.from(document.querySelectorAll('a[role="button"]'));
        return buttons.some(btn => btn.innerText.replace(/\s+/g, '').includes('Submit'));
    });
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('a[role="button"]'));
        for (let btn of buttons) {
            if (btn.innerText.replace(/\s+/g, '').includes('Submit')) {
                btn.focus();
                btn.click();
                break;
            }
        }
    });

    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));

    // Wait for the warning
    await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:1\\:AP1\\:tt1\\:okWarningDialog');
    await page.evaluate(() => {
        const btn = document.querySelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:1\\:AP1\\:tt1\\:okWarningDialog');
        if (btn) {
            btn.focus();
            btn.click();
        }
    });

    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));

    //final ok button
    await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:1\\:AP1\\:tt1\\:okConfirmationDialog');
    await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:1\\:AP1\\:tt1\\:okConfirmationDialog');

    for(let i=0;i<6;i++){
        //wait for 30 seconds 
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 30000)));
        console.log(`Waiting 30s at iteration ${i+1} for the request to be processed.`);
    }

    // Close the browser
    await browser.close();
}

module.exports = Scenario;
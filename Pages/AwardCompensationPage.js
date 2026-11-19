const AutomationError = require('../Utils/CustomError');

// requestTypes: plan name -> request type function (RequestTypes/index.js)
async function awardCompensation(page, browser, body, res, plan, personNumber, RequestID, HandleResponse, requestTypes) {
    try{
        await page.$eval(
        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:commandToolbarButton1 a',
        el => el.click()
        );
    } catch(error){
        await page.waitForSelector('tr.p_AFReadOnly td.x51');
        // Extract the messages
        const messages = await page.evaluate(() => {
        const elements = document.querySelectorAll('tr.p_AFReadOnly td.x51');
        return Array.from(elements).map(el => el.innerText.trim()).filter(Boolean);
        });
        throw new AutomationError(`Warning : ${messages.join(', ')}`, plan, personNumber, RequestID);
    }

    try{
    // Wait for Modal
    await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:CreatePopup\\:\\:popup-container', { visible: true });
    }
    catch(error){
    // Clicking the Award Compensation Button
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    
    console.log('No modal found, clicking the button again.');
    await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:commandToolbarButton1', { visible: true });
    await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:commandToolbarButton1 a');
    }

    console.log('plan name:', plan);

    //Call function based on plan name
    const requestType = Object.prototype.hasOwnProperty.call(requestTypes, plan) ? requestTypes[plan] : null;
    if (!requestType) {
        throw new AutomationError('Invalid plan name: ' + plan, plan, personNumber, RequestID);
    }
    await requestType(browser, page, body, res, plan, personNumber, RequestID, HandleResponse);
    console.log('Form filled for plan:', plan);
    
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

   // Submit request button
    const submitButtonSelector = '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:d2\\:\\:ok';
    await page.waitForSelector(submitButtonSelector, { visible: true });
    await page.click(submitButtonSelector);

    // After OK, Fusion either closes the award dialog (accepted) or shows a message dialog
    // (rejected, e.g. "ORA-20001: The data type DATE of parameter ..."). Fusion's formula can take
    // longer than a few seconds, so wait for whichever comes first instead of checking a fixed number of times.
    // Verified on the live UAT form: the message text sits in [id*="msgDlg"] .x1mu.
    const outcome = await page.waitForFunction(() => {
        const visible = (el) => !!el && (el.offsetParent !== null || el.getClientRects().length > 0);
        const message = [...document.querySelectorAll('[id*="msgDlg"] [class*="x1mu"]')].find(visible);
        if (message && message.innerText.trim()) return { error: message.innerText.trim() };
        const dialog = document.querySelector('[id$="CreatePopup::popup-container"]');
        if (!visible(dialog)) return { closed: true };
        return false;
    }, { timeout: 60000, polling: 500 })
        .then((handle) => handle.jsonValue())
        .catch(() => null);

    if (!outcome) {
        throw new AutomationError('Fusion did not accept the award: the dialog stayed open after OK with no message (60 s)', plan, personNumber, RequestID);
    }
    if (outcome.error) {
        console.log('❌ Fusion rejected the award:', outcome.error);
        throw new AutomationError(outcome.error, plan, personNumber, RequestID);
    }
    console.log('Award accepted by Fusion (dialog closed)');
}
module.exports = awardCompensation;






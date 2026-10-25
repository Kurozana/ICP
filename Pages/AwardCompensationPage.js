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
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    
    for (let i = 0; i < 5; i++) {
    try {
        await page.waitForSelector('[id*="msgDlg"] [class*="x1mu"]', { visible: true, timeout: 2000 });
        const errorText = await page.$eval('[id*="msgDlg"] [class*="x1mu"]', el => el.innerText.trim());
        if(errorText){
            console.log("❌ Inline error detected:", errorText);
            throw new AutomationError(errorText, plan, personNumber, RequestID);
        }
        console.log("❌ Inline error detected:", errorText);
    } catch (e) {
        if (e instanceof AutomationError) {
            throw new AutomationError(e.message, e.plan, e.personNumber, e.RequestID);
        }
        console.log('attempting to find error message : ' + i);
    }
    }

    try {
        await page.waitForSelector('[id*="popup-container"] [id*="msgDlg"] .x1mu span', { timeout: 5000 });
        const errorMessage = await page.$eval(
            '[id*="popup-container"] [id*="msgDlg"] .x1mu span',
            el => el.textContent.trim()
        );
        console.log("❌ Error popup detected:", errorMessage);
        throw new AutomationError(errorMessage, plan, personNumber, RequestID);
    } catch (error) {
        if (error instanceof AutomationError) {
            throw new AutomationError(error.message, error.plan, error.personNumber, error.RequestID);
        }
        console.error("No Error popup detected");
    }
}
module.exports = awardCompensation;






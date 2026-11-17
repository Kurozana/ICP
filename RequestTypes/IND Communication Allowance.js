const AutomationError = require('../Utils/CustomError');

async function INDCommunicationAllowance(browser, page, body, res, plan, personNumber, RequestID, HandleResponse) {
    // Destructure required fields from req.body
    const { option, PaymentType } = body;

    console.log('validating fields of :' + plan);

    // Validate required fields
    const missingFields = [];
    if (!option) missingFields.push('option');
    if (!PaymentType) missingFields.push('PaymentType');
    if (missingFields.length > 0) {
        throw new AutomationError('Missing required field(s): ' + missingFields.join(', '), plan, personNumber, RequestID);
    }

    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));

    // Open Plans Dropdown
    await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:soc3\\:\\:drop');
    await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:soc3\\:\\:drop');
    await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:soc3\\:\\:pop', { visible: true });
    await page.evaluate((plan) => {
        const items = document.querySelectorAll('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:soc3\\:\\:pop li');
        for (let item of items) {
            if (item.innerText.trim() === plan) {
                item.scrollIntoView();
                item.click();
                break;
            }
        }
    }, plan);

    // Validation Time for the plan
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        try {
            // Open Options Dropdown
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:soc4\\:\\:drop');
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:soc4\\:\\:drop');
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:soc4\\:\\:pop', { visible: true });
            await page.evaluate((option) => {
                const items = document.querySelectorAll('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:soc4\\:\\:pop li');
                for (let item of items) {
                    if (item.innerText.trim() === option) {
                        item.scrollIntoView();
                        item.click();
                        break;
                    }
                }
            }, option);
        } catch (error) {
            console.log("Retrying..|Selecting Option");
            // Open Options Dropdown
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:soc4\\:\\:drop');
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:soc4\\:\\:drop');
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:soc4\\:\\:pop', { visible: true });
            await page.evaluate((option) => {
                const items = document.querySelectorAll('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:soc4\\:\\:pop li');
                for (let item of items) {
                    if (item.innerText.trim() === option) {
                        item.scrollIntoView();
                        item.click();
                        break;
                    }
                }
            }, option);
        }
    } catch (error) {
        console.error('plan may not available:', error);
        throw new AutomationError('plan may not available', plan, personNumber, RequestID);
    }

    // Delay for option selection
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));

    try {
        //Payment Type
        await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:soc3\\:\\:drop');
        await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:16\\:lovScreenEntryValue\\:\\:drop');
        await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:16\\:lovScreenEntryValue\\:\\:pop', { visible: true });
        await page.evaluate((PaymentType) => {
            const options = document.querySelectorAll(
                '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:16\\:lovScreenEntryValue\\:\\:pop li'
            );
            for (const option of options) {
                if (option.innerText.trim() === PaymentType) {
                    option.scrollIntoView();
                    option.click();
                    break;
                }
            }
        }, PaymentType);
    } catch (error) {
        console.error('Retrying..| Selecting Payment Type:', error);
        //Payment Type
        await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:16\\:lovScreenEntryValue\\:\\:content');
        await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:16\\:lovScreenEntryValue\\:\\:content');
        await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:16\\:lovScreenEntryValue\\:\\:pop', { visible: true });
        await page.evaluate((PaymentType) => {
            const options = document.querySelectorAll(
                '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:16\\:lovScreenEntryValue\\:\\:pop li'
            );
            for (const option of options) {
                if (option.innerText.trim() === PaymentType) {
                    option.scrollIntoView();
                    option.click();
                    break;
                }
            }
        }, PaymentType);
    }

    //Wait for error popup
    try {
        await page.waitForSelector('#_FOd1\\:\\:popup-container', { visible: true, timeout: 3000 });
        const errorMessage = await page.$eval('#_FOd1\\:\\:msgDlg\\:\\:_ccntr .x1mu span', (el) => el.textContent.trim());
        throw new AutomationError(errorMessage, plan, personNumber, RequestID);
    } catch (error) {
        if (error instanceof AutomationError) {
            throw new AutomationError(error.message, error.plan, error.personNumber, error.RequestID);
        }
        console.log('No error message displayed, proceeding with the request.');
    }
}

module.exports = INDCommunicationAllowance;
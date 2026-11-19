const { error } = require("winston");
const AutomationError = require("../Utils/CustomError");

function exists(value) {
    return value !== null && value !== undefined && value !== '';
}

async function KSASchoolSupportProgram(browser, page, body, res, plan, personNumber, RequestID, HandleResponse) {
    const {
        option,
        ToDate,
        Fromdate,
        AcademicYear,
        ClaimType,
        SchoolFeeType,
        PaidAmount,
        Child,
        SchoolName,
        ChildGrade
    } = body;

    console.log('validating fields of :' + plan);

    // Validate required fields
    const missingFields = [];
    if (!option) missingFields.push('option');
    if (!ToDate) missingFields.push('ToDate');
    if (!Fromdate) missingFields.push('Fromdate');
    if (!AcademicYear) missingFields.push('AcademicYear');
    if (!ClaimType) missingFields.push('ClaimType');
    if (!PaidAmount) missingFields.push('PaidAmount');
    if (!Child) missingFields.push('Child');
    if (missingFields.length > 0) {
        throw new AutomationError('Missing required field(s): ' + missingFields.join(', '), plan, personNumber, RequestID);
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Field region prefix (unchanged); only the evIter numbers shifted after two new fields were added
    const PREFIX = '_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:';

    // ---- Field field-fill helpers ----
    async function selectLov(iter, value) {
        const drop = `#${PREFIX}${iter}\\:lovScreenEntryValue\\:\\:drop`;
        const pop = `#${PREFIX}${iter}\\:lovScreenEntryValue\\:\\:pop`;
        await page.waitForSelector(drop, { visible: true });
        await page.click(drop);
        await page.waitForSelector(pop, { visible: true });
        await page.evaluate((popSel, val) => {
            const items = document.querySelectorAll(popSel + ' li');
            for (let item of items) {
                if (item.innerText.trim() === val) {
                    item.scrollIntoView();
                    item.click();
                    break;
                }
            }
        }, pop, value);
    }

    async function fillDate(iter, value) {
        const sel = `input[id="${PREFIX}${iter}\\:screenEntryValueDate\\:\\:content"]`;
        await page.waitForSelector(sel, { visible: true });
        await page.focus(sel);
        await sleep(200);
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await sleep(200);
        await page.type(sel, value, { delay: 100 });
        await sleep(500);
        await page.keyboard.press('Enter');
        await sleep(3000);
    }

    async function fillNumber(iter, value) {
        const sel = `input[id="${PREFIX}${iter}\\:screenEntryValueNumber\\:\\:content"]`;
        await page.waitForSelector(sel, { visible: true });
        await page.click(sel, { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type(sel, value);
    }

    async function fillText(iter, value) {
        // Free-text fields (School Name / Child Grade) use the screenEntryValue suffix
        const sel = `input[id="${PREFIX}${iter}\\:screenEntryValue\\:\\:content"]`;
        await page.waitForSelector(sel, { visible: true });
        await page.click(sel, { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type(sel, value);
    }

    async function fillChild(value) {
        const sel = `input[id="${PREFIX}34\\:ValueSetScreenEntryValue1\\:\\:content"]`;
        const pop = `#${PREFIX}34\\:ValueSetScreenEntryValue1\\:\\:_afrautosuggestpopup li[role="option"]`;
        await page.waitForSelector(sel, { visible: true });
        await page.click(sel, { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type(sel, value, { delay: 120 });
        await sleep(3000);
        await page.waitForSelector(pop, { visible: true });
        const childFound = await page.evaluate((popSel, childName) => {
            const norm = (s) => (s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
            const target = norm(childName);
            const items = Array.from(document.querySelectorAll(popSel));
            for (let item of items) {
                const t = norm(item.innerText);
                if (t === "no results found.") return false;
                if (t === target || t.startsWith(target)) {
                    item.click();
                    return true;
                }
            }
            return false;
        }, pop, value);
        if (!childFound) {
            throw new AutomationError('No child exist with this provided name: ' + value, plan, personNumber, RequestID);
        }
    }

    // Fills the whole detail form in order. Called once, retried once on non-Automation errors.
    async function fillForm() {
        // Academic Year (evIter:28)
        await sleep(1000);
        await selectLov(28, AcademicYear);

        // Claim Type (evIter:29)
        await sleep(500);
        await selectLov(29, ClaimType);

        // School Fee Type (evIter:30) - optional
        if (exists(SchoolFeeType)) {
            await sleep(500);
            await selectLov(30, SchoolFeeType);
        }

        // From Date (evIter:31)
        await fillDate(31, Fromdate);

        // To Date (evIter:32)
        await fillDate(32, ToDate);

        // Paid Amount (evIter:33)
        await fillNumber(33, PaidAmount);
        // Commit Paid Amount so Fusion recomputes child eligibility before the Child LOV renders
        await page.keyboard.press('Tab');
        await sleep(4000);

        // Child (evIter:34)
        await fillChild(Child);

        // School Name (evIter:39) - optional
        if (exists(SchoolName)) {
            await fillText(39, SchoolName);
        }

        // Child Grade (evIter:40) - optional
        if (exists(ChildGrade)) {
            await fillText(40, ChildGrade);
        }
    }

    await sleep(3000);

    // Open Plans Dropdown (outer Award Compensation popup - unchanged prefix)
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
    await sleep(2000);

    // Open Options Dropdown (unchanged prefix)
    try {
        try {
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
    await sleep(3000);

    // Fill the detail form (one retry on transient errors)
    try {
        await fillForm();
    } catch (error) {
        if (error instanceof AutomationError) {
            throw new AutomationError(error.message, error.plan, error.personNumber, error.RequestID);
        }
        console.error('Retrying...|Error occurred while filling form ' + plan);
        await sleep(2000);
        await fillForm();
    }

    //Wait for error popup
    try {
        await page.waitForSelector('#DhtmlZOrderManagerLayerContainer #_FOd1\\:\\:popup-container', { visible: true, timeout: 3000 });
        const errorMessage = await page.$eval('#_FOd1\\:\\:msgDlg\\:\\:_ccntr .x1mu span', (el) => el.textContent.trim());
        await page.click('#_FOd1\\:\\:msgDlg\\:\\:cancel');
        throw new AutomationError(errorMessage, plan, personNumber, RequestID);
    } catch (error) {
        if (error instanceof AutomationError) {
            throw new AutomationError(error.message, error.plan, error.personNumber, error.RequestID);
        }
        console.log('No error message displayed, proceeding with the request.');
    }

};

module.exports = KSASchoolSupportProgram;

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
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));

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
        try {
            // Academic Year select dropdown (evIter:30)
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:drop');
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((AcademicYear) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === AcademicYear) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, AcademicYear); // Pass the value you want: e.g. "2023-2024", "2024-2025", or "2025-2026"
        } catch (error) {
            console.log("Retry selecting Academic Year");
            // Academic Year select dropdown (evIter:30)
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:drop');
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((AcademicYear) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === AcademicYear) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, AcademicYear); // Pass the value you want: e.g. "2023-2024", "2024-2025", or "2025-2026"
        }

        try {
            // Claim Type (main section, evIter:31)
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500))); // short delay for stability
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop');
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((ClaimType) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === ClaimType) { // "Tuition", "Books", "Transport"
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, ClaimType);
        } catch (error) {
            console.log("Retrying Claim Type selection...");
            // Claim Type (main section, evIter:31)
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500))); // short delay for stability
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop');
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((ClaimType) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === ClaimType) { // "Tuition", "Books", "Transport"
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, ClaimType);
        }

        if (exists(SchoolFeeType)) {
            try {
                // School Fee Type (main section, evIter:32)
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500))); // small pause for stability
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:drop');
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((SchoolFeeType) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === SchoolFeeType) { // e.g., "Monthly"
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, SchoolFeeType);
            } catch (error) {
                console.log("Retrying School Fee Type selection...");
                // School Fee Type (main section, evIter:32)
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500))); // small pause for stability
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:drop');
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((SchoolFeeType) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === SchoolFeeType) { // e.g., "Monthly"
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, SchoolFeeType);
            }
        }

        // -------- From Date --------
        const inputSelectorFromDateMain = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:33\\:screenEntryValueDate\\:\\:content"]';
        await page.waitForSelector(inputSelectorFromDateMain, { visible: true });

        // Focus the field
        await page.focus(inputSelectorFromDateMain);
        await new Promise(resolve => setTimeout(resolve, 200));

        // Clear with keyboard
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await new Promise(resolve => setTimeout(resolve, 200));

        // Type with delay between characters
        await page.type(inputSelectorFromDateMain, Fromdate, { delay: 100 });
        await new Promise(resolve => setTimeout(resolve, 500));

        // Press Enter instead of Tab
        await page.keyboard.press('Enter');
        await new Promise(resolve => setTimeout(resolve, 3000));


        // -------- To Date --------
        const inputSelectorToDateMain = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:34\\:screenEntryValueDate\\:\\:content"]';
        await page.waitForSelector(inputSelectorToDateMain, { visible: true });

        // Focus the field
        await page.focus(inputSelectorToDateMain);
        await new Promise(resolve => setTimeout(resolve, 200));

        // Clear with keyboard
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await new Promise(resolve => setTimeout(resolve, 200));

        // Type with delay between characters
        await page.type(inputSelectorToDateMain, ToDate, { delay: 100 });
        await new Promise(resolve => setTimeout(resolve, 500));

        // Press Enter instead of Tab
        await page.keyboard.press('Enter');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // -------- Paid Amount --------
        const inputSelectorPaidAmountMain = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:35\\:screenEntryValueNumber\\:\\:content"]';
        await page.waitForSelector(inputSelectorPaidAmountMain, { visible: true });
        await page.click(inputSelectorPaidAmountMain, { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type(inputSelectorPaidAmountMain, PaidAmount); // e.g. "5000"

        try {
            // -------- Child --------
            const inputSelectorChildMain = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:ValueSetScreenEntryValue1\\:\\:content"]';
            await page.waitForSelector(inputSelectorChildMain, { visible: true });
            await page.click(inputSelectorChildMain, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorChildMain, Child); // e.g. "2"

            // Wait for the suggestions to appear
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:ValueSetScreenEntryValue1\\:\\:_afrautosuggestpopup li[role="option"]', { visible: true });
            const childFound = await page.evaluate((selector, childName) => {
                const items = document.querySelectorAll(selector);
                for (let item of items) {
                    if (item.innerText.trim() === childName) {
                        item.click();
                        return true; // Found and clicked
                    }
                    if (item.innerText.trim().toLowerCase() === "No results found.".toLowerCase()) {
                        return false;
                    }
                }
                return false; // Not found
            }, '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:ValueSetScreenEntryValue1\\:\\:_afrautosuggestpopup li[role="option"]', Child);
        } catch (error) {
            if (error instanceof AutomationError) {
                throw new AutomationError(error.message, error.plan, error.personNumber, error.RequestID);
            }
            // -------- Child --------
            const inputSelectorChildMain = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:ValueSetScreenEntryValue1\\:\\:content"]';
            await page.waitForSelector(inputSelectorChildMain, { visible: true });
            await page.click(inputSelectorChildMain, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorChildMain, Child); // e.g. "2"
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
            // Wait for the suggestions to appear
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:ValueSetScreenEntryValue1\\:\\:_afrautosuggestpopup li[role="option"]', { visible: true });
            const childFound = await page.evaluate((selector, childName) => {
                const items = document.querySelectorAll(selector);
                for (let item of items) {
                    if (item.innerText.trim() === childName) {
                        item.click();
                        return true; // Found and clicked
                    }
                    if (item.innerText.trim().toLowerCase() === "No results found.".toLowerCase()) {
                        return false;
                    }
                }
                return false; // Not found
            }, '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:ValueSetScreenEntryValue1\\:\\:_afrautosuggestpopup li[role="option"]', Child);
            if (!childFound) {
                throw new AutomationError('No child exist with this provided name: ' + Child, plan, personNumber, RequestID);
            }
        }

        // -------- School Name --------
        if (exists(SchoolName)) {
            const inputSelectorSchoolName = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:39\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelectorSchoolName, { visible: true });
            await page.click(inputSelectorSchoolName, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorSchoolName, SchoolName);
        }

        // -------- Child Grade --------
        if (exists(ChildGrade)) {
            const inputSelectorChildGrade = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:40\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelectorChildGrade, { visible: true });
            await page.click(inputSelectorChildGrade, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorChildGrade, ChildGrade);
        }

    } catch (error) {
        console.error('Retrying...|Error occurred while filling form ' + plan);
        if (error instanceof AutomationError) {
            throw new AutomationError(error.message, error.plan, error.personNumber, error.RequestID);
        }
        try {
            // Academic Year select dropdown (evIter:30)
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:drop');
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
            await page.evaluate((AcademicYear) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === AcademicYear) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, AcademicYear); // Pass the value you want: e.g. "2023-2024", "2024-2025", or "2025-2026"
        } catch (error) {
            console.log("Retry selecting Academic Year");
            // Academic Year select dropdown (evIter:30)
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:drop');
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((AcademicYear) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:30\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === AcademicYear) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, AcademicYear); // Pass the value you want: e.g. "2023-2024", "2024-2025", or "2025-2026"
        }

        try {
            // Claim Type (main section, evIter:31)
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500))); // short delay for stability
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop');
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((ClaimType) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === ClaimType) { // "Tuition", "Books", "Transport"
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, ClaimType);
        } catch (error) {
            console.log("Retrying Claim Type selection...");
            // Claim Type (main section, evIter:31)
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500))); // short delay for stability
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop');
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((ClaimType) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === ClaimType) { // "Tuition", "Books", "Transport"
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, ClaimType);
        }

        if (exists(SchoolFeeType)) {
            try {
                // School Fee Type (main section, evIter:32)
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500))); // small pause for stability
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:drop');
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((SchoolFeeType) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === SchoolFeeType) { // e.g., "Monthly"
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, SchoolFeeType);
            } catch (error) {
                console.log("Retrying School Fee Type selection...");
                // School Fee Type (main section, evIter:32)
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500))); // small pause for stability
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:drop');
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((SchoolFeeType) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === SchoolFeeType) { // e.g., "Monthly"
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, SchoolFeeType);
            }
        }

        // -------- From Date --------
        const inputSelectorFromDateMain = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:33\\:screenEntryValueDate\\:\\:content"]';
        await page.waitForSelector(inputSelectorFromDateMain, { visible: true });

        // Focus the field
        await page.focus(inputSelectorFromDateMain);
        await new Promise(resolve => setTimeout(resolve, 200));

        // Clear with keyboard
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await new Promise(resolve => setTimeout(resolve, 200));

        // Type with delay between characters
        await page.type(inputSelectorFromDateMain, Fromdate, { delay: 100 });
        await new Promise(resolve => setTimeout(resolve, 500));

        // Press Enter instead of Tab
        await page.keyboard.press('Enter');
        await new Promise(resolve => setTimeout(resolve, 3000));


        // -------- To Date --------
        const inputSelectorToDateMain = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:34\\:screenEntryValueDate\\:\\:content"]';
        await page.waitForSelector(inputSelectorToDateMain, { visible: true });

        // Focus the field
        await page.focus(inputSelectorToDateMain);
        await new Promise(resolve => setTimeout(resolve, 200));

        // Clear with keyboard
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await new Promise(resolve => setTimeout(resolve, 200));

        // Type with delay between characters
        await page.type(inputSelectorToDateMain, ToDate, { delay: 100 });
        await new Promise(resolve => setTimeout(resolve, 500));

        // Press Enter instead of Tab
        await page.keyboard.press('Enter');
        await new Promise(resolve => setTimeout(resolve, 3000));


        // -------- Paid Amount --------
        const inputSelectorPaidAmountMain = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:35\\:screenEntryValueNumber\\:\\:content"]';
        await page.waitForSelector(inputSelectorPaidAmountMain, { visible: true });
        await page.click(inputSelectorPaidAmountMain, { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type(inputSelectorPaidAmountMain, PaidAmount); // e.g. "5000"

        // Delay
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));

        try {
            // -------- Child --------
            const inputSelectorChildMain = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:ValueSetScreenEntryValue1\\:\\:content"]';
            await page.waitForSelector(inputSelectorChildMain, { visible: true });
            await page.click(inputSelectorChildMain, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorChildMain, Child); // e.g. "2"
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
            // Wait for the suggestions to appear
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:ValueSetScreenEntryValue1\\:\\:_afrautosuggestpopup li[role="option"]', { visible: true });
            const childFound = await page.evaluate((selector, childName) => {
                const items = document.querySelectorAll(selector);
                for (let item of items) {
                    if (item.innerText.trim() === childName) {
                        item.click();
                        return true; // Found and clicked
                    }
                    if (item.innerText.trim().toLowerCase() === "No results found.".toLowerCase()) {
                        return false;
                    }
                }
                return false; // Not found
            }, '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:ValueSetScreenEntryValue1\\:\\:_afrautosuggestpopup li[role="option"]', Child);
        } catch (error) {
            if (error instanceof AutomationError) {
                throw new AutomationError(error.message, error.plan, error.personNumber, error.RequestID);
            }
            console.error("retrying...| child selection");
            // -------- Child --------
            const inputSelectorChildMain = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:ValueSetScreenEntryValue1\\:\\:content"]';
            await page.waitForSelector(inputSelectorChildMain, { visible: true });
            await page.click(inputSelectorChildMain, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorChildMain, Child); // e.g. "2"
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
            // Wait for the suggestions to appear
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:ValueSetScreenEntryValue1\\:\\:_afrautosuggestpopup li[role="option"]', { visible: true });
            const childFound = await page.evaluate((selector, childName) => {
                const items = document.querySelectorAll(selector);
                for (let item of items) {
                    if (item.innerText.trim() === childName) {
                        item.click();
                        return true; // Found and clicked
                    }
                    if (item.innerText.trim().toLowerCase() === "No results found.".toLowerCase()) {
                        return false;
                    }
                }
                return false; // Not found
            }, '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:ValueSetScreenEntryValue1\\:\\:_afrautosuggestpopup li[role="option"]', Child);
            if (!childFound) {
                throw new AutomationError('No child exist with this provided name: ' + Child, plan, personNumber, RequestID);
            }
        }

        // -------- School Name --------
        if (exists(SchoolName)) {
            const inputSelectorSchoolName = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:39\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelectorSchoolName, { visible: true });
            await page.click(inputSelectorSchoolName, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorSchoolName, SchoolName);
        }

        // -------- Child Grade --------
        if (exists(ChildGrade)) {
            const inputSelectorChildGrade = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:40\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelectorChildGrade, { visible: true });
            await page.click(inputSelectorChildGrade, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorChildGrade, ChildGrade);
        }
    }
    //Wait for error popup
    try {
        await page.waitForSelector('#DhtmlZOrderManagerLayerContainer #_FOd1\\:\\:popup-container', { visible: true, timeout: 3000 });
        errorMessage = await page.$eval('#_FOd1\\:\\:msgDlg\\:\\:_ccntr .x1mu span', (el) => el.textContent.trim());
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
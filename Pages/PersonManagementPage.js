const navigateToIndividualCompensation = async (page, personNumber) => {
    // Login only returns once the browser is already inside Fusion (after MFA), so the page load
    // has usually finished by now. Waiting for a new navigation here would time out, so wait for
    // the Person Number field instead: it works whether the page is still loading or already loaded.
    await page.waitForSelector('input[id="_FOpt1:_FOr1:0:_FONSr2:0:MAt1:0:pt1:Perso1:0:SP3:q1:value10::content"]', { visible: true, timeout: 60000 });

    try {
        // Wait for and type person number
        await page.waitForSelector('input[id="_FOpt1:_FOr1:0:_FONSr2:0:MAt1:0:pt1:Perso1:0:SP3:q1:value10::content"]', { visible: true });
        await page.click('input[id="_FOpt1:_FOr1:0:_FONSr2:0:MAt1:0:pt1:Perso1:0:SP3:q1:value10::content"]', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('input[id="_FOpt1:_FOr1:0:_FONSr2:0:MAt1:0:pt1:Perso1:0:SP3:q1:value10::content"]', personNumber);

        // Validation time for the person number field
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));

        // Click Search button
        await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:pt1\\:Perso1\\:0\\:SP3\\:q1\\:\\:search');

        // Click Action dropdown
        await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:pt1\\:Perso1\\:0\\:SP3\\:table1\\:_ATp\\:table2\\:0\\:cil1', { visible: true });
        await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:pt1\\:Perso1\\:0\\:SP3\\:table1\\:_ATp\\:table2\\:0\\:cil1');

        // Click Compensation dropdown
        await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:pt1\\:Perso1\\:0\\:SP3\\:table1\\:am2\\:dc_i1\\:2\\:dcm1', { visible: true });
        await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:pt1\\:Perso1\\:0\\:SP3\\:table1\\:am2\\:dc_i1\\:2\\:dcm1');

        // Click Individual Compensation
        await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:pt1\\:Perso1\\:0\\:SP3\\:table1\\:am2\\:dc_i1\\:2\\:dci1\\:1\\:dccmi1', { visible: true });
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:pt1\\:Perso1\\:0\\:SP3\\:table1\\:am2\\:dc_i1\\:2\\:dci1\\:1\\:dccmi1')
        ]);
    } catch (error) {
        console.error('Retrying... | navigating to Individual Compensation');

        // Wait for and type person number
        await page.waitForSelector('input[id="_FOpt1:_FOr1:0:_FONSr2:0:MAt1:0:pt1:Perso1:0:SP3:q1:value10::content"]', { visible: true });
        await page.click('input[id="_FOpt1:_FOr1:0:_FONSr2:0:MAt1:0:pt1:Perso1:0:SP3:q1:value10::content"]', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('input[id="_FOpt1:_FOr1:0:_FONSr2:0:MAt1:0:pt1:Perso1:0:SP3:q1:value10::content"]', personNumber);

        // Validation time for the person number field
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));

        // Click Search button
        await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:pt1\\:Perso1\\:0\\:SP3\\:q1\\:\\:search');

        // Click Action dropdown
        await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:pt1\\:Perso1\\:0\\:SP3\\:table1\\:_ATp\\:table2\\:0\\:cil1', { visible: true });
        await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:pt1\\:Perso1\\:0\\:SP3\\:table1\\:_ATp\\:table2\\:0\\:cil1');

        // Click Compensation dropdown
        await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:pt1\\:Perso1\\:0\\:SP3\\:table1\\:am2\\:dc_i1\\:2\\:dcm1', { visible: true });
        await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:pt1\\:Perso1\\:0\\:SP3\\:table1\\:am2\\:dc_i1\\:2\\:dcm1');

        // Click Individual Compensation
        await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:pt1\\:Perso1\\:0\\:SP3\\:table1\\:am2\\:dc_i1\\:2\\:dci1\\:1\\:dccmi1', { visible: true });
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:pt1\\:Perso1\\:0\\:SP3\\:table1\\:am2\\:dc_i1\\:2\\:dci1\\:1\\:dccmi1')
        ]);
    }
    console.log('Navigated to Individual Compensation page');
};

module.exports = navigateToIndividualCompensation;
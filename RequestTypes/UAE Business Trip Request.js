const AutomationError = require("../Utils/CustomError");

function exists(value) {
    return value !== null && value !== undefined && value !== '';
}

async function UAEBusinessTripRequest(browser, page, body, res, plan, personNumber, RequestID, HandleResponse) {
    // Destructure required fields from req.body
    const {
        option,
        PurposeofTravel,

        TripLocation1,
        StartDate1,
        EndDate1,
        LeavingFrom1,
        Goingto1,
        FlightDuration1,
        TicketRequired1,
        DepartureTime1,
        DurationInDays1,
        TicketClass1,
        HotelBooking1,
        HotelPrice1,
        PerDiem1,

        TripLocation2,
        StartDate2,
        EndDate2,
        LeavingFrom2,
        Goingto2,
        FlightDuration2,
        TicketRequired2,
        DepartureTime2,
        DurationInDays2,
        TicketClass2,
        HotelBooking2,
        HotelPrice2,
        PerDiem2,

        TripLocation3,
        StartDate3,
        EndDate3,
        LeavingFrom3,
        Goingto3,
        FlightDuration3,
        TicketRequired3,
        DepartureTime3,
        DurationInDays3,
        TicketClass3,
        HotelBooking3,
        HotelPrice3,
        PerDiem3,

        TripLocation4,
        StartDate4,
        EndDate4,
        LeavingFrom4,
        Goingto4,
        FlightDuration4,
        TicketRequired4,
        DepartureTime4,
        DurationInDays4,
        TicketClass4,
        HotelBooking4,
        HotelPrice4,
        PerDiem4,
    } = body;

    // Validate required fields individually and return specific error
    const requiredFields = {
        option,
        PurposeofTravel,
        TripLocation1,
        StartDate1,
        EndDate1,
        LeavingFrom1,
        Goingto1,
        FlightDuration1,
        TicketRequired1,
        HotelBooking1
    };

    console.log('validating fields of :' + plan);

    const missingFields = [];
    for (const [field, value] of Object.entries(requiredFields)) {
        if (!value) {
            missingFields.push(field);
        }
    }
    if (missingFields.length > 0) {
        throw new AutomationError('Missing required fields: ' + missingFields.join(', '), plan, personNumber, RequestID);
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

    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));

    // Begin form
    try {
        // Purpose of Travel
        const screenEntrySelector = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:2\\:screenEntryValue\\:\\:content"]';
        await page.waitForSelector(screenEntrySelector, { visible: true });
        await page.click(screenEntrySelector, { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type(screenEntrySelector, PurposeofTravel);

        try {
            // Trip Location Type Dropdown
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((TripLoc) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:pop li'
                );

                for (let option of options) {
                    if (option.innerText.trim() === TripLoc) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, TripLocation1);
        } catch (error) {
            console.log("Trip Location Type Dropdown not found or not clickable, retrying...");
            // Trip Location Type Dropdown
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((TripLoc) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:pop li'
                );

                for (let option of options) {
                    if (option.innerText.trim() === TripLoc) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, TripLocation1);
        }

        // Start Date1
        const inputSelector1 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:4\\:screenEntryValueDate\\:\\:content"]';
        await page.waitForSelector(inputSelector1, { visible: true });
        for (let i = 0; i < 7; i++) {
            await page.click(inputSelector1, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log(`Clearing Start Date field: iteration ${i + 1}`);
        }
        await page.type(inputSelector1, StartDate1, { delay: 50 });

        // End Date1
        const inputSelector2 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:5\\:screenEntryValueDate\\:\\:content"]';
        await page.waitForSelector(inputSelector2, { visible: true });
        for (let i = 0; i < 7; i++) {
            await page.click(inputSelector2, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log(`Clearing End Date field: iteration ${i + 1}`);
        }
        await page.type(inputSelector2, EndDate1, { delay: 50 });

        // Leaving From1
        const inputSelector3 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:6\\:screenEntryValue\\:\\:content"]';
        await page.waitForSelector(inputSelector3, { visible: true });
        await page.click(inputSelector3, { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type(inputSelector3, LeavingFrom1);
        await page.keyboard.press('Tab');

        //going to1
        const inputSelector4 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:7\\:screenEntryValue\\:\\:content"]';
        await page.waitForSelector(inputSelector4, { visible: true });
        await page.click(inputSelector4, { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type(inputSelector4, Goingto1); // Replace SomeValue with your actual value
        await page.keyboard.press('Tab');

        try {
            // Flight Duration1
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((DurationValue) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:pop li'
                );

                for (let option of options) {
                    if (option.innerText.trim() === DurationValue) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, FlightDuration1);
        } catch (error) {
            console.log("Error occurred while selecting Flight Duration (retrying):", error);
            // Flight Duration1
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((DurationValue) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:pop li'
                );

                for (let option of options) {
                    if (option.innerText.trim() === DurationValue) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, FlightDuration1);
        }

        try {
            // Ticket Required1
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((TicketRequired1) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === TicketRequired1) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, TicketRequired1);
        } catch (error) {
            console.log("Retrying Ticket Required selection...");
            // Ticket Required1
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((TicketRequired1) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === TicketRequired1) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, TicketRequired1);
        }

        if (exists(DepartureTime1)) {
            // Departure Time1
            const inputSelector5 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:10\\:screenEntryValueDate\\:\\:content"]';
            await page.waitForSelector(inputSelector5, { visible: true });
            await page.click(inputSelector5, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelector5, DepartureTime1); // Replace DepartureTime1 with your actual value (e.g., '2:30 PM')
        }

        try {
            //Hotel Booking1
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            // Select desired option (e.g., "Cash", "Agent Arrangement")
            await page.evaluate((desiredValue) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === desiredValue) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, HotelBooking1); // Replace PaymentMethod with a string like "Cash"
        } catch (error) {
            console.log("Retrying Hotel Booking selection...");
            //Hotel Booking1
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            // Select desired option (e.g., "Cash", "Agent Arrangement")
            await page.evaluate((desiredValue) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === desiredValue) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, HotelBooking1); // Replace PaymentMethod with a string like "Cash"
        }

    } catch (error) {
        console.log("Retrying ..|Error filling Trip 1 fields");
        // Purpose of Travel
        const screenEntrySelector = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:2\\:screenEntryValue\\:\\:content"]';
        await page.waitForSelector(screenEntrySelector, { visible: true });
        await page.click(screenEntrySelector, { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type(screenEntrySelector, PurposeofTravel);

        try {
            // Trip Location Type Dropdown
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((TripLoc) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:pop li'
                );

                for (let option of options) {
                    if (option.innerText.trim() === TripLoc) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, TripLocation1);
        } catch (error) {
            console.log("Trip Location Type Dropdown not found or not clickable, retrying...");
            // Trip Location Type Dropdown
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((TripLoc) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:3\\:lovScreenEntryValue\\:\\:pop li'
                );

                for (let option of options) {
                    if (option.innerText.trim() === TripLoc) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, TripLocation1);
        }

        // Start Date1
        const inputSelector1 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:4\\:screenEntryValueDate\\:\\:content"]';
        await page.waitForSelector(inputSelector1, { visible: true });
        for (let i = 0; i < 7; i++) {
            await page.click(inputSelector1, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log(`Clearing Start Date field: iteration ${i + 1}`);
        }
        await page.type(inputSelector1, StartDate1, { delay: 50 });

        // End Date1
        const inputSelector2 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:5\\:screenEntryValueDate\\:\\:content"]';
        await page.waitForSelector(inputSelector2, { visible: true });
        for (let i = 0; i < 7; i++) {
            await page.click(inputSelector2, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log(`Clearing End Date field: iteration ${i + 1}`);
        }
        await page.type(inputSelector2, EndDate1, { delay: 50 });

        // Leaving From1
        const inputSelector3 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:6\\:screenEntryValue\\:\\:content"]';
        await page.waitForSelector(inputSelector3, { visible: true });
        await page.click(inputSelector3, { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type(inputSelector3, LeavingFrom1);
        await page.keyboard.press('Tab');

        //going to1
        const inputSelector4 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:7\\:screenEntryValue\\:\\:content"]';
        await page.waitForSelector(inputSelector4, { visible: true });
        await page.click(inputSelector4, { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type(inputSelector4, Goingto1); // Replace SomeValue with your actual value
        await page.keyboard.press('Tab');

        try {
            // Flight Duration1
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((DurationValue) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:pop li'
                );

                for (let option of options) {
                    if (option.innerText.trim() === DurationValue) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, FlightDuration1);
        } catch (error) {
            console.log("Error occurred while selecting Flight Duration (retrying):", error);
            // Flight Duration1
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((DurationValue) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:8\\:lovScreenEntryValue\\:\\:pop li'
                );

                for (let option of options) {
                    if (option.innerText.trim() === DurationValue) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, FlightDuration1);
        }

        try {
            // Ticket Required1
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((TicketRequired1) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === TicketRequired1) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, TicketRequired1);
        } catch (error) {
            console.log("Retrying Ticket Required selection...");
            // Ticket Required1
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            await page.evaluate((TicketRequired1) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:9\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === TicketRequired1) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, TicketRequired1);
        }

        if (exists(DepartureTime1)) {
            // Departure Time1
            const inputSelector5 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:10\\:screenEntryValueDate\\:\\:content"]';
            await page.waitForSelector(inputSelector5, { visible: true });
            await page.click(inputSelector5, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelector5, DepartureTime1); // Replace DepartureTime1 with your actual value (e.g., '2:30 PM')
        }

        try {
            //Hotel Booking1
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            // Select desired option (e.g., "Cash", "Agent Arrangement")
            await page.evaluate((desiredValue) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === desiredValue) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, HotelBooking1); // Replace PaymentMethod with a string like "Cash"
        } catch (error) {
            console.log("Retrying Hotel Booking selection...");
            //Hotel Booking1
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:drop', { visible: true });
            await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
            await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:pop', { visible: true });
            // Select desired option (e.g., "Cash", "Agent Arrangement")
            await page.evaluate((desiredValue) => {
                const options = document.querySelectorAll(
                    '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:13\\:lovScreenEntryValue\\:\\:pop li'
                );
                for (let option of options) {
                    if (option.innerText.trim() === desiredValue) {
                        option.scrollIntoView();
                        option.click();
                        break;
                    }
                }
            }, HotelBooking1); // Replace PaymentMethod with a string like "Cash"
        }
    }

    //TRIP 2(optional)
    //------------------------

    if (
        exists(TripLocation2) && exists(StartDate2) && exists(EndDate2) &&
        exists(LeavingFrom2) && exists(Goingto2) && exists(FlightDuration2) &&
        exists(TicketRequired2) && exists(HotelBooking2)
    ) {
        try {
            try {
                //Travel location2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TripLocation2) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:pop li'
                    );

                    for (let option of options) {
                        if (option.innerText.trim() === TripLocation2) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TripLocation2);
            } catch (error) {
                console.log("Retrying Travel Location selection...");
                //Travel location2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TripLocation2) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:pop li'
                    );

                    for (let option of options) {
                        if (option.innerText.trim() === TripLocation2) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TripLocation2);
            }

            // Start Date2
            const inputSelector10 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:18\\:screenEntryValueDate\\:\\:content"]';
            await page.waitForSelector(inputSelector10, { visible: true });
            await page.click(inputSelector10, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelector10, StartDate2); // Replace StartDate2 with your actual value

            // End Date2
            const inputSelector11 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:19\\:screenEntryValueDate\\:\\:content"]';
            await page.waitForSelector(inputSelector11, { visible: true });
            await page.click(inputSelector11, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelector11, EndDate2); // Replace EndDate2 with your actual value

            //Leaving From
            const inputSelector12 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:20\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelector12, { visible: true });
            await page.click(inputSelector12, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelector12, LeavingFrom2);
            await page.keyboard.press('Tab');

            // Going To (Trip 2)
            const inputSelectorGoingTo2 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:21\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelectorGoingTo2, { visible: true });
            await page.click(inputSelectorGoingTo2, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorGoingTo2, Goingto2);
            await page.keyboard.press('Tab');

            try {
                // Flight Duration2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((DurationValue) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === DurationValue) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, FlightDuration2);
            } catch (error) {
                console.log('Retrying Flight Duration selection...');
                // Flight Duration2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((DurationValue) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === DurationValue) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, FlightDuration2);
            }

            try {
                // Ticket Required2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TicketRequired2) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TicketRequired2) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TicketRequired2);
            } catch (error) {
                console.log("Retrying Ticket Required2 selection...");
                // Ticket Required2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TicketRequired2) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TicketRequired2) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TicketRequired2);
            }

            if (exists(DepartureTime2)) {
                // Departure Time2
                const inputSelectorDepartureTime2 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:24\\:screenEntryValueDate\\:\\:content"]';
                await page.waitForSelector(inputSelectorDepartureTime2, { visible: true });
                await page.click(inputSelectorDepartureTime2, { clickCount: 3 });
                await page.keyboard.press('Backspace');
                await page.type(inputSelectorDepartureTime2, DepartureTime2); // e.g., '9:15 AM'
                await page.keyboard.press('Tab');
            }

            try {
                // Hotel Booking2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                // Select desired option (e.g., "Cash", "Agent Arrangement")
                await page.evaluate((HotelBooking2) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === HotelBooking2) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, HotelBooking2); // Example: "Cash" or "Agent Arrangement"
            } catch (error) {
                console.log("Retry selecting Hotel Booking2:", error);
                // Hotel Booking2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                // Select desired option (e.g., "Cash", "Agent Arrangement")
                await page.evaluate((HotelBooking2) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === HotelBooking2) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, HotelBooking2); // Example: "Cash" or "Agent Arrangement"
            }
        } catch (error) {
            console.log("Error occurred while filling Trip 2 details:", error);
            try {
                //Travel location2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TripLocation2) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:pop li'
                    );

                    for (let option of options) {
                        if (option.innerText.trim() === TripLocation2) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TripLocation2);
            } catch (error) {
                console.log("Retrying Travel Location selection...");
                //Travel location2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TripLocation2) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:17\\:lovScreenEntryValue\\:\\:pop li'
                    );

                    for (let option of options) {
                        if (option.innerText.trim() === TripLocation2) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TripLocation2);
            }

            // Start Date2
            const inputSelector10 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:18\\:screenEntryValueDate\\:\\:content"]';
            await page.waitForSelector(inputSelector10, { visible: true });
            await page.click(inputSelector10, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelector10, StartDate2); // Replace StartDate2 with your actual value

            // End Date2
            const inputSelector11 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:19\\:screenEntryValueDate\\:\\:content"]';
            await page.waitForSelector(inputSelector11, { visible: true });
            await page.click(inputSelector11, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelector11, EndDate2); // Replace EndDate2 with your actual value

            //Leaving From
            const inputSelector12 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:20\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelector12, { visible: true });
            await page.click(inputSelector12, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelector12, LeavingFrom2);
            await page.keyboard.press('Tab');

            // Going To (Trip 2)
            const inputSelectorGoingTo2 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:21\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelectorGoingTo2, { visible: true });
            await page.click(inputSelectorGoingTo2, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorGoingTo2, Goingto2);
            await page.keyboard.press('Tab');

            try {
                // Flight Duration2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((DurationValue) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === DurationValue) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, FlightDuration2);
            } catch (error) {
                console.log('Retrying Flight Duration selection...');
                // Flight Duration2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((DurationValue) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:22\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === DurationValue) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, FlightDuration2);
            }

            try {
                // Ticket Required2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TicketRequired2) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TicketRequired2) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TicketRequired2);
            } catch (error) {
                console.log("Retrying Ticket Required2 selection...");
                // Ticket Required2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TicketRequired2) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:23\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TicketRequired2) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TicketRequired2);
            }

            if (exists(DepartureTime2)) {
                // Departure Time2
                const inputSelectorDepartureTime2 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:24\\:screenEntryValueDate\\:\\:content"]';
                await page.waitForSelector(inputSelectorDepartureTime2, { visible: true });
                await page.click(inputSelectorDepartureTime2, { clickCount: 3 });
                await page.keyboard.press('Backspace');
                await page.type(inputSelectorDepartureTime2, DepartureTime2); // e.g., '9:15 AM'
                await page.keyboard.press('Tab');
            }

            try {
                // Hotel Booking2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                // Select desired option (e.g., "Cash", "Agent Arrangement")
                await page.evaluate((HotelBooking2) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === HotelBooking2) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, HotelBooking2); // Example: "Cash" or "Agent Arrangement"
            } catch (error) {
                console.log("Retry selecting Hotel Booking2:", error);
                // Hotel Booking2
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                // Select desired option (e.g., "Cash", "Agent Arrangement")
                await page.evaluate((HotelBooking2) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:27\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === HotelBooking2) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, HotelBooking2); // Example: "Cash" or "Agent Arrangement"
            }
        }
    }

    //TRIP 3(Optional)
    //------------------------
    if (
        exists(TripLocation3) && exists(StartDate3) && exists(EndDate3) &&
        exists(LeavingFrom3) && exists(Goingto3) && exists(FlightDuration3) &&
        exists(TicketRequired3) && exists(HotelBooking3)
    ) {
        try {
            try {
                // Trip Location3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TripLocation3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TripLocation3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TripLocation3); // e.g., "Middle East, Africa, the India"
            } catch (error) {
                console.log("Retrying Trip Location3 selection...");
                // Trip Location3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TripLocation3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TripLocation3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TripLocation3); // e.g., "Middle East, Africa, the India"
            }

            // Start Date3
            const inputSelectorStartDate3 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:screenEntryValueDate\\:\\:content"]';
            await page.waitForSelector(inputSelectorStartDate3, { visible: true });
            await page.click(inputSelectorStartDate3, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorStartDate3, StartDate3); // e.g., '9/1/25'
            await page.keyboard.press('Tab');

            // End Date3
            const inputSelectorEndDate3 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:33\\:screenEntryValueDate\\:\\:content"]';
            await page.waitForSelector(inputSelectorEndDate3, { visible: true });
            await page.click(inputSelectorEndDate3, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorEndDate3, EndDate3); // e.g., '9/5/25'
            await page.keyboard.press('Tab');

            // Leaving From3
            const inputSelectorLeavingFrom3 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:34\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelectorLeavingFrom3, { visible: true });
            await page.click(inputSelectorLeavingFrom3, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorLeavingFrom3, LeavingFrom3); // e.g., "eee"
            await page.keyboard.press('Tab');

            // Going To3
            const inputSelectorGoingTo3 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:35\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelectorGoingTo3, { visible: true });
            await page.click(inputSelectorGoingTo3, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorGoingTo3, Goingto3); // e.g., "fff"
            await page.keyboard.press('Tab');

            try {
                // Ticket Required3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TicketRequired3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TicketRequired3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TicketRequired3); // Example values: "Yes" or "No"
            } catch (error) {
                console.log("Retrying Ticket Required3 selection...");
                // Ticket Required3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TicketRequired3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TicketRequired3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TicketRequired3); // Example values: "Yes" or "No"
            }

            try {
                // Flight Duration3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((FlightDuration3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === FlightDuration3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, FlightDuration3); // Pass a string like "Less Than 10 Hours" or "More Than 10 Hours"
            } catch (error) {
                console.log("Retrying Flight Duration3 selection...");
                // Flight Duration3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((FlightDuration3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === FlightDuration3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, FlightDuration3); // Pass a string like "Less Than 10 Hours" or "More Than 10 Hours"
            }

            if (exists(DepartureTime3)) {
                // Departure Time3
                const inputSelectorDepartureTime3 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:38\\:screenEntryValueDate\\:\\:content"]';
                await page.waitForSelector(inputSelectorDepartureTime3, { visible: true });
                await page.click(inputSelectorDepartureTime3, { clickCount: 3 });
                await page.keyboard.press('Backspace');
                await page.type(inputSelectorDepartureTime3, DepartureTime3); // e.g., "9:15 AM"
                await page.keyboard.press('Tab');
            }

            try {
                // Hotel Booking3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                // Select desired option (e.g., "Agent Arrangement" or "Cash")
                await page.evaluate((HotelBooking3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === HotelBooking3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, HotelBooking3); // Example: "Agent Arrangement" or "Cash"
            } catch (error) {
                console.log("Retrying hotel booking selection...");
                // Hotel Booking3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                // Select desired option (e.g., "Agent Arrangement" or "Cash")
                await page.evaluate((HotelBooking3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === HotelBooking3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, HotelBooking3); // Example: "Agent Arrangement" or "Cash"
            }
        } catch (error) {
            console.error('Retrying...|Error occurred while filling Trip 3 details:', error);
            try {
                // Trip Location3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TripLocation3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TripLocation3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TripLocation3); // e.g., "Middle East, Africa, the India"
            } catch (error) {
                console.log("Retrying Trip Location3 selection...");
                // Trip Location3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TripLocation3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:31\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TripLocation3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TripLocation3); // e.g., "Middle East, Africa, the India"
            }

            // Start Date3
            const inputSelectorStartDate3 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:32\\:screenEntryValueDate\\:\\:content"]';
            await page.waitForSelector(inputSelectorStartDate3, { visible: true });
            await page.click(inputSelectorStartDate3, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorStartDate3, StartDate3); // e.g., '9/1/25'
            await page.keyboard.press('Tab');

            // End Date3
            const inputSelectorEndDate3 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:33\\:screenEntryValueDate\\:\\:content"]';
            await page.waitForSelector(inputSelectorEndDate3, { visible: true });
            await page.click(inputSelectorEndDate3, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorEndDate3, EndDate3); // e.g., '9/5/25'
            await page.keyboard.press('Tab');

            // Leaving From3
            const inputSelectorLeavingFrom3 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:34\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelectorLeavingFrom3, { visible: true });
            await page.click(inputSelectorLeavingFrom3, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorLeavingFrom3, LeavingFrom3); // e.g., "eee"
            await page.keyboard.press('Tab');

            // Going To3
            const inputSelectorGoingTo3 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:35\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelectorGoingTo3, { visible: true });
            await page.click(inputSelectorGoingTo3, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorGoingTo3, Goingto3); // e.g., "fff"
            await page.keyboard.press('Tab');

            try {
                // Ticket Required3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TicketRequired3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TicketRequired3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TicketRequired3); // Example values: "Yes" or "No"
            } catch (error) {
                console.log("Retrying Ticket Required3 selection...");
                // Ticket Required3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TicketRequired3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:37\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TicketRequired3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TicketRequired3); // Example values: "Yes" or "No"
            }

            try {
                // Flight Duration3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((FlightDuration3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === FlightDuration3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, FlightDuration3); // Pass a string like "Less Than 10 Hours" or "More Than 10 Hours"
            } catch (error) {
                console.log("Retrying Flight Duration3 selection...");
                // Flight Duration3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((FlightDuration3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:36\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === FlightDuration3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, FlightDuration3); // Pass a string like "Less Than 10 Hours" or "More Than 10 Hours"
            }

            if (exists(DepartureTime3)) {
                // Departure Time3
                const inputSelectorDepartureTime3 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:38\\:screenEntryValueDate\\:\\:content"]';
                await page.waitForSelector(inputSelectorDepartureTime3, { visible: true });
                await page.click(inputSelectorDepartureTime3, { clickCount: 3 });
                await page.keyboard.press('Backspace');
                await page.type(inputSelectorDepartureTime3, DepartureTime3); // e.g., "9:15 AM"
                await page.keyboard.press('Tab');
            }

            try {
                // Hotel Booking3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                // Select desired option (e.g., "Agent Arrangement" or "Cash")
                await page.evaluate((HotelBooking3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === HotelBooking3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, HotelBooking3); // Example: "Agent Arrangement" or "Cash"
            } catch (error) {
                console.log("Retrying hotel booking selection...");
                // Hotel Booking3
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                // Select desired option (e.g., "Agent Arrangement" or "Cash")
                await page.evaluate((HotelBooking3) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:41\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === HotelBooking3) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, HotelBooking3); // Example: "Agent Arrangement" or "Cash"
            }
        }
    }
    //TRIP 4(Optional)
    //------------------------
    if (
        exists(TripLocation4) && exists(StartDate4) && exists(EndDate4) &&
        exists(LeavingFrom4) && exists(Goingto4) && exists(FlightDuration4) &&
        exists(TicketRequired4) && exists(HotelBooking4)
    ) {
        try {
            try {
                // Trip Location4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TripLocation4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:pop li'
                    );

                    for (let option of options) {
                        if (option.innerText.trim() === TripLocation4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TripLocation4); // e.g., "Middle East, Africa, the India"
            } catch (error) {
                console.log('Retrying Trip Location4 selection...');
                // Trip Location4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TripLocation4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:pop li'
                    );

                    for (let option of options) {
                        if (option.innerText.trim() === TripLocation4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TripLocation4); // e.g., "Middle East, Africa, the India"
            }

            // Start Date4
            const inputSelectorStartDate4 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:46\\:screenEntryValueDate\\:\\:content"]';
            await page.waitForSelector(inputSelectorStartDate4, { visible: true });
            await page.click(inputSelectorStartDate4, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorStartDate4, StartDate4); // e.g., "9/10/25"
            await page.keyboard.press('Tab');

            // End Date4
            const inputSelectorEndDate4 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:47\\:screenEntryValueDate\\:\\:content"]';
            await page.waitForSelector(inputSelectorEndDate4, { visible: true });
            await page.click(inputSelectorEndDate4, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorEndDate4, EndDate4); // e.g., "9/15/25"
            await page.keyboard.press('Tab');

            // Leaving From4
            const inputSelectorLeavingFrom4 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:48\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelectorLeavingFrom4, { visible: true });
            await page.click(inputSelectorLeavingFrom4, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorLeavingFrom4, LeavingFrom4); // e.g., "New York"
            await page.keyboard.press('Tab');

            // Going To4
            const inputSelectorGoingTo4 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:49\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelectorGoingTo4, { visible: true });
            await page.click(inputSelectorGoingTo4, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorGoingTo4, Goingto4); // e.g., "Los Angeles"
            await page.keyboard.press('Tab');

            try {
                // Flight Duration4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((FlightDuration4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === FlightDuration4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, FlightDuration4); // Example: "Less Than 10 Hours" or "More Than 10 Hours"
            } catch (error) {
                console.log("Retrying Flight Duration4 selection...");
                // Flight Duration4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((FlightDuration4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === FlightDuration4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, FlightDuration4); // Example: "Less Than 10 Hours" or "More Than 10 Hours"
            }

            try {
                // Ticket Required4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TicketRequired4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TicketRequired4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TicketRequired4); // Example: "Yes" or "No"
            } catch (error) {
                console.log("Retrying Ticket Required4 selection...");
                // Ticket Required4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TicketRequired4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TicketRequired4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TicketRequired4); // Example: "Yes" or "No"
            }

            if (exists(DepartureTime4)) {
                // Departure Time4
                const inputSelectorDepartureTime4 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:52\\:screenEntryValueDate\\:\\:content"]';
                await page.waitForSelector(inputSelectorDepartureTime4, { visible: true });
                await page.click(inputSelectorDepartureTime4, { clickCount: 3 });
                await page.keyboard.press('Backspace');
                await page.type(inputSelectorDepartureTime4, DepartureTime4); // e.g., "9:30 AM"
                await page.keyboard.press('Tab');
            }

            try {
                // Hotel Booking4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((HotelBooking4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === HotelBooking4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, HotelBooking4); // Example: "Agent Arrangement" or "Cash"
            } catch (error) {
                console.log("Retrying Hotel Booking4 selection...");
                // Hotel Booking4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((HotelBooking4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === HotelBooking4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, HotelBooking4); // Example: "Agent Arrangement" or "Cash"
            }
        } catch (error) {
            console.log("Retrying... |Error occurred while filling Trip 4 details: ", error);
            try {
                // Trip Location4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TripLocation4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:pop li'
                    );

                    for (let option of options) {
                        if (option.innerText.trim() === TripLocation4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TripLocation4); // e.g., "Middle East, Africa, the India"
            } catch (error) {
                console.log('Retrying Trip Location4 selection...');
                // Trip Location4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TripLocation4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:45\\:lovScreenEntryValue\\:\\:pop li'
                    );

                    for (let option of options) {
                        if (option.innerText.trim() === TripLocation4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TripLocation4); // e.g., "Middle East, Africa, the India"
            }

            // Start Date4
            const inputSelectorStartDate4 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:46\\:screenEntryValueDate\\:\\:content"]';
            await page.waitForSelector(inputSelectorStartDate4, { visible: true });
            await page.click(inputSelectorStartDate4, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorStartDate4, StartDate4); // e.g., "9/10/25"
            await page.keyboard.press('Tab');

            // End Date4
            const inputSelectorEndDate4 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:47\\:screenEntryValueDate\\:\\:content"]';
            await page.waitForSelector(inputSelectorEndDate4, { visible: true });
            await page.click(inputSelectorEndDate4, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorEndDate4, EndDate4); // e.g., "9/15/25"
            await page.keyboard.press('Tab');

            // Leaving From4
            const inputSelectorLeavingFrom4 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:48\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelectorLeavingFrom4, { visible: true });
            await page.click(inputSelectorLeavingFrom4, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorLeavingFrom4, LeavingFrom4); // e.g., "New York"
            await page.keyboard.press('Tab');

            // Going To4
            const inputSelectorGoingTo4 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:49\\:screenEntryValue\\:\\:content"]';
            await page.waitForSelector(inputSelectorGoingTo4, { visible: true });
            await page.click(inputSelectorGoingTo4, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type(inputSelectorGoingTo4, Goingto4); // e.g., "Los Angeles"
            await page.keyboard.press('Tab');

            try {
                // Flight Duration4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((FlightDuration4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === FlightDuration4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, FlightDuration4); // Example: "Less Than 10 Hours" or "More Than 10 Hours"
            } catch (error) {
                console.log("Retrying Flight Duration4 selection...");
                // Flight Duration4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((FlightDuration4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:50\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === FlightDuration4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, FlightDuration4); // Example: "Less Than 10 Hours" or "More Than 10 Hours"
            }

            try {
                // Ticket Required4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TicketRequired4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TicketRequired4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TicketRequired4); // Example: "Yes" or "No"
            } catch (error) {
                console.log("Retrying Ticket Required4 selection...");
                // Ticket Required4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((TicketRequired4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:51\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === TicketRequired4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, TicketRequired4); // Example: "Yes" or "No"
            }

            if (exists(DepartureTime4)) {
                // Departure Time4
                const inputSelectorDepartureTime4 = 'input[id="_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:52\\:screenEntryValueDate\\:\\:content"]';
                await page.waitForSelector(inputSelectorDepartureTime4, { visible: true });
                await page.click(inputSelectorDepartureTime4, { clickCount: 3 });
                await page.keyboard.press('Backspace');
                await page.type(inputSelectorDepartureTime4, DepartureTime4); // e.g., "9:30 AM"
                await page.keyboard.press('Tab');
            }

            try {
                // Hotel Booking4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((HotelBooking4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === HotelBooking4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, HotelBooking4); // Example: "Agent Arrangement" or "Cash"
            } catch (error) {
                console.log("Retrying Hotel Booking4 selection...");
                // Hotel Booking4
                await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:drop', { visible: true });
                await page.click('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:drop', { clickCount: 1 });
                await page.waitForSelector('#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:pop', { visible: true });
                await page.evaluate((HotelBooking4) => {
                    const options = document.querySelectorAll(
                        '#_FOpt1\\:_FOr1\\:0\\:_FONSr2\\:0\\:MAt1\\:0\\:AP1\\:r2\\:0\\:AT3\\:_ATp\\:r1\\:1\\:evIter\\:55\\:lovScreenEntryValue\\:\\:pop li'
                    );
                    for (let option of options) {
                        if (option.innerText.trim() === HotelBooking4) {
                            option.scrollIntoView();
                            option.click();
                            break;
                        }
                    }
                }, HotelBooking4); // Example: "Agent Arrangement" or "Cash"
            }
        }
    }
}
module.exports = UAEBusinessTripRequest;

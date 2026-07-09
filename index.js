require('dotenv').config({ override: true });
const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require("fs");
const path = require("path");

// Importing the pages
const Scenario = require('./Pages/Scenario');
const Login = require('./Pages/LoginPage');
const PersonManagement = require('./Pages/PersonManagementPage');
const awardCompensation = require('./Pages/AwardCompensationPage');

//importing the request types
const INDCommunicationAllowance = require('./RequestTypes/IND Communication Allowance');
const INDOvertimeRequest = require('./RequestTypes/IND Overtime Request');
const INDBusinessTripRequest = require('./RequestTypes/IND Business Trip Request');
const KSABuisnessTripRequest = require('./RequestTypes/KSA Business Trip Request');
const KSACommunicationAllowance = require('./RequestTypes/KSA Communication allowance');
const KSAOvertimeRequest = require('./RequestTypes/KSA Overtime Request');
const KSASchoolSupportProgram = require('./RequestTypes/KSA School Support Program');
const UAEBusinessTripRequest = require('./RequestTypes/UAE Business Trip Request');
const UAECommunicationAllowance = require('./RequestTypes/UAE Communication Allowance');
const UAEOvertimeRequest = require('./RequestTypes/UAE Overtime Request');
const UAESchoolSupportProgram = require('./RequestTypes/UAE School Support Program');
const AutomationError = require('./Utils/CustomError');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

//env variables
const PORT = process.env.PORT;
//Port 3000 – UAT & Development
//Port 5000 – Production

const url = process.env.ICP_NODE_URL;
const username = process.env.ICP_GCPUSERNAME;
const password = process.env.ICP_GCPPASSWORD;
const MendixEndpoint = process.env.MENDIX_ENDPOINT;
const XApiKey = process.env.X_API_KEY;

// Track active browsers with PIDs for better cleanup
const activeBrowsers = new Map(); // Changed from Set to Map to store PID info

// Enhanced browser counting with zombie detection
function countBrowsers() {
    const procDir = "/proc";
    let activeCount = 0;
    const activeProcesses = [];
    const zombieProcesses = [];

    try {
        const pids = fs.readdirSync(procDir).filter(f => /^\d+$/.test(f));

        for (const pid of pids) {
            try {
                const commPath = path.join(procDir, pid, "comm");
                const statusPath = path.join(procDir, pid, "status");

                if (!fs.existsSync(commPath) || !fs.existsSync(statusPath)) continue;

                const name = fs.readFileSync(commPath, "utf8").trim().toLowerCase();
                const status = fs.readFileSync(statusPath, "utf8");

                // Skip non-Chrome processes
                if (!name.includes("chrome") && !name.includes("chromium")) continue;

                const isZombie = status.includes('State:\tZ');

                if (isZombie || name.includes("chrome_crashpad")) {
                    // Track zombies separately
                    zombieProcesses.push({ pid, name, isZombie: true });
                } else {
                    // Active browser
                    activeCount++;
                    activeProcesses.push({ pid, name, isZombie: false });
                }

            } catch (e) {
                // Process may have disappeared
            }
        }

        if (activeProcesses.length > 0) {
            console.log('Active browser processes:', activeProcesses);
        }
        if (zombieProcesses.length > 0) {
            console.log('Zombie browser processes:', zombieProcesses);
        }

    } catch (err) {
        console.error("Error scanning /proc:", err.message);
    }

    return activeCount;
}


// Safe browser launch with tracking
async function launchBrowserSafely() {
    const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,  
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-crashpad',
            '--disable-software-rasterizer',
            '--disable-extensions',
            '--no-zygote',

            // ⚠️ Optional – see note below
            // '--single-process',

            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection'
        ]
    });

    // Track browser with PID
    const browserPID = browser.process()?.pid;
    if (browserPID) {
        activeBrowsers.set(browser, browserPID);
        console.log(`Browser launched with PID: ${browserPID}`);
    }

    return browser;
}

// Safe browser closure with comprehensive cleanup
async function closeBrowserSafely(browser) {
    if (!browser) return;

    const browserPID = activeBrowsers.get(browser);
    console.log(`Starting cleanup for browser PID: ${browserPID}`);

    try {
        // Close all pages first
        const pages = await browser.pages();
        console.log(`Closing ${pages.length} pages...`);

        for (const page of pages) {
            try {
                if (!page.isClosed()) {
                    await page.close();
                }
            } catch (e) {
                console.log('Error closing page:', e.message);
            }
        }

        // Graceful browser close
        if (browser.isConnected()) {
            await browser.close();
        }

        console.log(`Browser ${browserPID} closed gracefully`);

    } catch (error) {
        console.error('Error during graceful browser closure:', error.message);
    }

    // Force kill the process if it still exists
    if (browserPID) {
        try {
            process.kill(browserPID, 'SIGKILL');
            console.log(`Force killed browser process ${browserPID}`);
        } catch (e) {
            // Process already dead or doesn't exist
            console.log(`Browser process ${browserPID} already terminated`);
        }
    }

    // Remove from tracking
    activeBrowsers.delete(browser);
}

// Enhanced cleanup function for all browsers
async function cleanupAllBrowsers() {
    console.log(`Cleaning up ${activeBrowsers.size} tracked browsers...`);

    // Close all tracked browsers gracefully
    const cleanupPromises = Array.from(activeBrowsers.keys()).map(browser =>
        closeBrowserSafely(browser).catch(console.error)
    );

    await Promise.all(cleanupPromises);

    // Clear the tracking map
    activeBrowsers.clear();

    // Force kill only zombie Chromium processes
    const procDir = "/proc";

    try {
        const pids = fs.readdirSync(procDir).filter(f => /^\d+$/.test(f));

        for (const pid of pids) {
            const statusPath = path.join(procDir, pid, "status");
            const commPath = path.join(procDir, pid, "comm");

            if (!fs.existsSync(statusPath) || !fs.existsSync(commPath)) continue;

            const name = fs.readFileSync(commPath, "utf8").trim().toLowerCase();
            if (!name.includes("chrome") && !name.includes("chromium")) continue;

            const status = fs.readFileSync(statusPath, "utf8");
            if (status.includes("State:\tZ")) {
                try {
                    process.kill(parseInt(pid), "SIGKILL"); // Kill only zombie
                    console.log(`Killed zombie process ${name} (PID: ${pid})`);
                } catch (e) {
                    console.log(`Failed to kill PID ${pid}: ${e.message}`);
                }
            }
        }
    } catch (err) {
        console.error("Error scanning /proc for zombies:", err.message);
    }
}

// Log browser count every 10 seconds
setInterval(() => {
    const count = countBrowsers();
    const tracked = activeBrowsers.size;
    console.log(`Total browsers: ${count}, Tracked: ${tracked}`);
    if (count > tracked) {
        console.warn(`⚠️ Found ${count - tracked} untracked browser processes!`);
    }
}, 10000);

//Automate Function perform actions - FIXED VERSION
async function automateAction(req, res) {
    const { plan, personNumber, RequestID } = req.body;
    let browser = null;
    let page = null;

    try {
        // Launch browser safely
        browser = await launchBrowserSafely();
        page = await browser.newPage();

        // Set timeouts to prevent hanging
        page.setDefaultTimeout(30000);
        page.setDefaultNavigationTimeout(30000);

        // First attempt
        try {
            await Scenario(res, req.body, page, browser, username, password, url, Login, PersonManagement, awardCompensation, HandleResponse,
                INDCommunicationAllowance,
                INDOvertimeRequest,
                INDBusinessTripRequest,
                KSABuisnessTripRequest,
                KSACommunicationAllowance,
                KSAOvertimeRequest,
                KSASchoolSupportProgram,
                UAEBusinessTripRequest,
                UAECommunicationAllowance,
                UAEOvertimeRequest,
                UAESchoolSupportProgram,
            );

            HandleResponse(plan, personNumber, RequestID, 'Success', 'Request has been Successfully Submitted in Oracle Fusion');

        } catch (error) {
            // Handle specific detached node errors with retry
            if (error.message.includes('Node is detached from document') ||
                error.message.includes('Node is either not clickable or not an Element') ||
                error.message.includes('detached Frame')) {

                console.log('Detached node error detected, retrying with new page...');

                // Close current page
                if (page && !page.isClosed()) {
                    await page.close();
                }

                // Create new page
                page = await browser.newPage();
                page.setDefaultTimeout(30000);
                page.setDefaultNavigationTimeout(30000);

                // Clear cookies and try again
                await browser.deleteCookie(...(await browser.cookies()));

                // Retry the scenario
                await Scenario(res, req.body, page, browser, username, password, url, Login, PersonManagement, awardCompensation, HandleResponse,
                    INDCommunicationAllowance,
                    INDOvertimeRequest,
                    INDBusinessTripRequest,
                    KSABuisnessTripRequest,
                    KSACommunicationAllowance,
                    KSAOvertimeRequest,
                    KSASchoolSupportProgram,
                    UAEBusinessTripRequest,
                    UAECommunicationAllowance,
                    UAEOvertimeRequest,
                    UAESchoolSupportProgram,
                );

                HandleResponse(plan, personNumber, RequestID, 'Success', 'Request has been Successfully Submitted in Oracle Fusion');

            } else {
                throw error; // Re-throw other errors
            }
        }

    } catch (error) {
        // Handle all other errors
        if (error instanceof AutomationError) {
            console.error("Custom AutomationError handled: " + error.message);
            HandleResponse(error.plan, error.personNumber, error.RequestID, error.status, error.message);
        } else {
            console.error('Error occurred during automation: ' + error.message);
            HandleResponse(plan, personNumber, RequestID, 'Failed', 'Automation failed : Please try Again!, ' + error.message);
        }

    } finally {
        if (browser) {
            await closeBrowserSafely(browser);
        }
    }
}

//Mendix post API Handling
function HandleResponse(Plan, EmployeeID, RequestID, Status, Message) {
    const payload = {
        Plan: String(Plan),
        EmployeeID: String(EmployeeID),
        Status: String(Status),
        UpdatedDate: new Date().toISOString(),
        RequestID: String(RequestID),
        Message: String(Message)
    };
    console.log('payload:', JSON.stringify(payload, null, 2));
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    };
    if (XApiKey) {
        config.headers['x-api-key'] = XApiKey;
    }

    axios.post(MendixEndpoint, payload, config)
        .then(response => {
            if (response.status === 200) {
                console.log('Success:', response.data);
            }
        })
        .catch(error => {
            if (error.response) {
                console.error("Mendix Error:", error.response.status, error.response.data);
            } else {
                console.error("Error sending data to Mendix:", error.message);
            }
        });
}

app.get('/', (req, res) => {
    res.send("Welcome to the Automation API");
});

// Enhanced kill browsers endpoint
app.get("/kill-browsers", async (req, res) => {
    try {
        console.log('Force killing all browsers...');
        await cleanupAllBrowsers();

        const remainingCount = countBrowsers();
        console.log(`Cleanup completed. Remaining processes: ${remainingCount}`);

        res.json({
            success: true,
            message: "✅ All Chrome/Chromium processes killed forcefully",
            remainingProcesses: remainingCount,
            trackedBrowsers: activeBrowsers.size
        });
    } catch (err) {
        console.error("Error killing browsers:", err.message);
        res.status(500).json({
            success: false,
            message: "❌ Failed to kill browsers",
            error: err.message
        });
    }
});

// Browser status endpoint
app.get("/browser-status", (req, res) => {
    const totalCount = countBrowsers();
    const trackedCount = activeBrowsers.size;
    const activePIDs = Array.from(activeBrowsers.values());

    res.json({
        totalBrowserProcesses: totalCount,
        trackedBrowsers: trackedCount,
        activeBrowserPIDs: activePIDs,
        hasUntracked: totalCount > trackedCount
    });
});

app.post('/update-env', (req, res) => {
    return res.status(200).send(
        `To update environment variables, follow these steps:
        To apply the changes:

        1️⃣ Update the .env file located in the 'Files' folder.

        2️⃣ Stop the existing container:
            sudo docker stop icp_PROD

        3️⃣ Remove the existing container:
            sudo docker rm icp_PROD

        4️⃣ Start a new container using the updated .env file:
            sudo docker run -d --name icp_PROD \\
                --env-file Files/.env \\
                -p 3000:3000 \\
                --restart always \\
                jebershon/node-automate:v18_PROD_P3000`
    );
});

// Endpoint to automate login and perform actions
app.post('/automate-login', async (req, res) => {
    // Start automation without blocking response
    automateAction(req, res).catch(error => {
        console.error('Unhandled automation error:', error);
    });

    return res.status(200).json({ success: true, message: 'Request has been received Successfully' });
});

// Process cleanup handlers
process.on('exit', async () => {
    console.log('Application exiting, cleaning up browsers...');
    await cleanupAllBrowsers();
});

process.on('SIGINT', async () => {
    console.log('Received SIGINT, cleaning up browsers...');
    await cleanupAllBrowsers();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, cleaning up browsers...');
    await cleanupAllBrowsers();
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error);
    await cleanupAllBrowsers();
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await cleanupAllBrowsers();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (process.env.ICP_NODE_URL && process.env.ICP_GCPUSERNAME && process.env.ICP_GCPPASSWORD && process.env.MENDIX_ENDPOINT) {
        console.log('env successfully recognized...');
    } else {
        console.error('One or more environment variables are missing.');
    }
});
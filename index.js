require('dotenv').config({ override: true });
const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const fs = require("fs");
const path = require("path");

// Importing the pages
const Scenario = require('./Pages/Scenario');
const Login = require('./Pages/LoginPage');
const PersonManagement = require('./Pages/PersonManagementPage');
const awardCompensation = require('./Pages/AwardCompensationPage');

//importing the request types (plan name -> function)
const requestTypes = require('./RequestTypes');
const AutomationError = require('./Utils/CustomError');
const HandleResponse = require('./Utils/MendixNotification');
const log = require('./Utils/log');
const { getRetryReason } = require('./Utils/retryableError');
const validateRequest = require('./Utils/validateRequest');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

//env variables
const PORT = process.env.PORT;
//Port 3000 – UAT & Development
//Port 5000 – Production

const url = process.env.Fusion_URL;
const username = process.env.Fusion_USERNAME;
const password = process.env.Fusion_PASSWORD;

// Track active browsers with PIDs for better cleanup
const activeBrowsers = new Map(); // Changed from Set to Map to store PID info

// Browser counting with zombie detection.
// Each browser runs several chrome processes (renderer, GPU, utility); only the top-level one
// (whose parent is not chrome) is counted, so the count matches activeBrowsers.size.
function countBrowsers() {
    const procDir = "/proc";
    const chromeProcesses = [];

    try {
        const pids = fs.readdirSync(procDir).filter(f => /^\d+$/.test(f));

        for (const pid of pids) {
            try {
                const commPath = path.join(procDir, pid, "comm");
                const statusPath = path.join(procDir, pid, "status");

                if (!fs.existsSync(commPath) || !fs.existsSync(statusPath)) continue;

                const name = fs.readFileSync(commPath, "utf8").trim().toLowerCase();

                // Skip non-Chrome processes
                if (!name.includes("chrome") && !name.includes("chromium")) continue;

                const status = fs.readFileSync(statusPath, "utf8");
                const ppid = (status.match(/^PPid:\s*(\d+)/m) || [])[1];
                const isZombie = status.includes('State:\tZ');
                chromeProcesses.push({ pid, ppid, name, isZombie });

            } catch (e) {
                // Process may have disappeared
            }
        }

    } catch (err) {
        log.error(`Error scanning /proc: ${err.message}`);
    }

    const chromePids = new Set(chromeProcesses.map(p => p.pid));
    const zombieProcesses = chromeProcesses.filter(p => p.isZombie);
    const activeProcesses = chromeProcesses.filter(p =>
        !p.isZombie && !p.name.includes("chrome_crashpad") && !chromePids.has(p.ppid)
    );

    return { activeCount: activeProcesses.length, activeProcesses, zombieProcesses };
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
        log.info(`Browser launched with PID: ${browserPID}`);
    }

    return browser;
}

// Safe browser closure with comprehensive cleanup
async function closeBrowserSafely(browser) {
    if (!browser) return;

    const browserPID = activeBrowsers.get(browser);
    log.info(`Starting cleanup for browser PID: ${browserPID}`);

    try {
        // Close all pages first
        const pages = await browser.pages();
        log.info(`Closing ${pages.length} pages...`);

        for (const page of pages) {
            try {
                if (!page.isClosed()) {
                    await page.close();
                }
            } catch (e) {
                log.warn(`Error closing page: ${e.message}`);
            }
        }

        // Graceful browser close
        if (browser.isConnected()) {
            await browser.close();
        }

        log.info(`Browser ${browserPID} closed gracefully`);

    } catch (error) {
        log.error(`Error during graceful browser closure: ${error.message}`);
    }

    // Force kill the process if it still exists
    if (browserPID) {
        try {
            process.kill(browserPID, 'SIGKILL');
            log.info(`Force killed browser process ${browserPID}`);
        } catch (e) {
            // Process already dead or doesn't exist
            log.info(`Browser process ${browserPID} already terminated`);
        }
    }

    // Remove from tracking
    activeBrowsers.delete(browser);
}

// Enhanced cleanup function for all browsers
async function cleanupAllBrowsers() {
    log.info(`Cleaning up ${activeBrowsers.size} tracked browsers...`);

    // Close all tracked browsers gracefully
    const cleanupPromises = Array.from(activeBrowsers.keys()).map(browser =>
        closeBrowserSafely(browser).catch(e => log.error(`Error closing browser: ${e.message}`))
    );

    await Promise.all(cleanupPromises);

    // Clear the tracking map
    activeBrowsers.clear();
}

// Check browser count every 10 seconds, log only when it changes (/proc exists only on Linux)
let lastBrowserSummary = '';
if (process.platform === 'linux') {
    setInterval(() => {
        const { activeCount, activeProcesses, zombieProcesses } = countBrowsers();
        const tracked = activeBrowsers.size;
        const summary = `${activeCount}/${zombieProcesses.length}/${tracked}`;
        if (summary === lastBrowserSummary) return;
        lastBrowserSummary = summary;

        log.info(`Total browsers: ${activeCount}, Zombies: ${zombieProcesses.length}, Tracked: ${tracked}`, { activeProcesses, zombieProcesses });
        if (activeCount > tracked) {
            log.warn(`⚠️ Found ${activeCount - tracked} untracked browser processes!`);
        }
    }, 10000).unref();   // never keeps the process alive on its own (Express does)
}

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

        const runScenario = (currentPage) => Scenario(res, req.body, currentPage, browser, username, password, url,
            Login, PersonManagement, awardCompensation, HandleResponse, requestTypes);

        // At most one retry, and only for page/DOM errors (see Utils/retryableError.js)
        const MAX_ATTEMPTS = 2;
        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                await runScenario(page);
                break;
            } catch (error) {
                const retryReason = getRetryReason(error);
                if (!retryReason || attempt === MAX_ATTEMPTS) {
                    throw error;
                }

                log.info(`Retryable browser error (${retryReason}), retrying with new page...`, { error: error.message });

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
            }
        }

        HandleResponse(plan, personNumber, RequestID, 'Success', 'Request has been Successfully Submitted in Oracle Fusion');

    } catch (error) {
        // Handle all other errors
        if (error instanceof AutomationError) {
            log.error("Custom AutomationError handled: " + error.message);
            HandleResponse(error.plan, error.personNumber, error.RequestID, error.status, error.message);
        } else {
            log.error('Error occurred during automation: ' + error.message);
            HandleResponse(plan, personNumber, RequestID, 'Failed', 'Automation failed : Please try Again!, ' + error.message);
        }

    } finally {
        if (browser) {
            await closeBrowserSafely(browser);
        }
    }
}

app.get('/check', (req, res) => {
    res.send("Welcome to the Automation API");
});

// Endpoint to automate login and perform actions
app.post('/automate-login', async (req, res) => {
    const { plan, personNumber, RequestID } = req.body || {};

    // Check the request before launching a browser (see Utils/validateRequest.js)
    const check = validateRequest(req.body, requestTypes);
    if (check.result === 'reject') {
        log.warn(`Rejected /automate-login: ${check.message}`, { plan, personNumber, RequestID });
        return res.status(400).json({ success: false, message: check.message });
    }
    if (check.result === 'fail') {
        log.warn(`Request failed validation: ${check.message}`, { plan, personNumber, RequestID });
        HandleResponse(plan, personNumber, RequestID, 'Failed', check.message);
        return res.status(200).json({ success: true, message: 'Request has been received Successfully' });
    }

    // Start automation without blocking response
    automateAction(req, res).catch(error => {
        log.error('Unhandled automation error:', error);
    });

    return res.status(200).json({ success: true, message: 'Request has been received Successfully' });
});

// Process cleanup handlers
// Zombie processes are reaped by tini (Dockerfile ENTRYPOINT), so only tracked browsers are cleaned up here.
const SHUTDOWN_TIMEOUT_MS = 10000;
let isShuttingDown = false;

async function shutdown(reason, exitCode) {
    if (isShuttingDown) return;   // second signal while cleaning up: ignore, the timeout below still applies
    isShuttingDown = true;
    log.info(`${reason}, cleaning up browsers...`);

    // Exit even if a browser hangs while closing
    setTimeout(() => {
        log.error(`Cleanup did not finish in ${SHUTDOWN_TIMEOUT_MS / 1000}s, exiting anyway`);
        process.exit(exitCode);
    }, SHUTDOWN_TIMEOUT_MS).unref();

    await cleanupAllBrowsers();
    process.exit(exitCode);
}

// 'exit' cannot wait for async work, so only force-kill the browser processes still tracked
process.on('exit', () => {
    for (const pid of activeBrowsers.values()) {
        try { process.kill(pid, 'SIGKILL'); } catch (e) { /* already gone */ }
    }
});

process.on('SIGINT', () => shutdown('Received SIGINT', 0));
process.on('SIGTERM', () => shutdown('Received SIGTERM', 0));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    log.error('Uncaught Exception:', error);
    shutdown('Uncaught exception', 1);
});

// Log only: closing every browser here would also kill automations that are running fine
process.on('unhandledRejection', (reason) => {
    log.error('Unhandled Rejection:', reason instanceof Error ? reason : { reason: String(reason) });
});

// Start the server only when run directly (node index.js); tests require the app without listening
if (require.main === module) {
    // Express 5 calls this callback with an error too (e.g. port already in use)
    app.listen(PORT, (error) => {
        if (error) {
            log.error(`Server could not start on port ${PORT}: ${error.message}`);
            process.exit(1);
        }
        log.info(`Server is running on port ${PORT}`);
        if (process.env.Fusion_URL && process.env.Fusion_USERNAME && process.env.Fusion_PASSWORD
            && process.env.APIGEE_NOTIFICATION_URL && process.env.APIGEE_TOKEN_URL && process.env.APIGEE_API_KEY && process.env.APIGEE_API_SECRET) {
            log.info('env successfully recognized...');
        } else {
            log.error('One or more environment variables are missing.');
        }
    });
}

module.exports = app;


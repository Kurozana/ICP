const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { TargetCloseError } = require('puppeteer');
const { fakeBrowser, loadAppWith, listen, waitFor } = require('./helpers');
const AutomationError = require('../Utils/CustomError');

// What the fake Scenario should do per RequestID: one entry per attempt (an Error to throw, or null to succeed)
const scenarioScript = {};
const attempts = {};
const notifications = [];
let browsersLaunched = 0;
let server;

before(async () => {
    const realPuppeteer = require('puppeteer');
    const app = loadAppWith({
        puppeteer: { ...realPuppeteer, launch: async () => { browsersLaunched++; return fakeBrowser(); } },
        './Pages/Scenario': async (res, body) => {
            const id = body.RequestID;
            attempts[id] = (attempts[id] || 0) + 1;
            const outcome = (scenarioScript[id] || [])[attempts[id] - 1];
            if (outcome) throw outcome;
        },
        './Utils/MendixNotification': async (plan, employeeID, requestID, status, message) => {
            notifications.push({ requestID: String(requestID), status, message });
        },
    });
    server = await listen(app);
});

after(() => server.close());

beforeEach(() => {
    notifications.length = 0;
    browsersLaunched = 0;
});

const post = async (body) => {
    const response = await fetch(`${server.url}/automate-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return { status: response.status, json: await response.json() };
};

const PLAN = 'KSA Overtime Request';

// ---- retry loop (point 4/5) ----
const RETRY_CASES = [
    ['detached once, then works', '101', [new Error('Node is detached from document'), null], 2, 'Success'],
    ['detached twice', '102', [new Error('Node is detached from document'), new Error('Node is detached from document')], 2, 'Failed'],
    ['TargetCloseError, then works', '103', [new TargetCloseError('Target closed'), null], 2, 'Success'],
    ['AutomationError is not retried', '104', [new AutomationError('Oracle said no', PLAN, '1', '104')], 1, 'Failed'],
    ['other error is not retried', '105', [new Error('Waiting for selector failed')], 1, 'Failed'],
    ['works first time', '106', [null], 1, 'Success'],
];

for (const [name, id, script, expectedAttempts, expectedStatus] of RETRY_CASES) {
    test(`retry: ${name}`, async () => {
        scenarioScript[id] = script;
        const { status } = await post({ plan: PLAN, personNumber: '1', RequestID: id });
        await waitFor(200);   // automation runs after the response

        assert.equal(status, 200);
        assert.equal(attempts[id], expectedAttempts);
        const sent = notifications.filter(n => n.requestID === id);
        assert.equal(sent.length, 1);
        assert.equal(sent[0].status, expectedStatus);
    });
}

// ---- request checks (point 3) ----
const VALIDATION_CASES = [
    ['missing RequestID', { plan: PLAN, personNumber: '123' }, 400, 'Missing RequestID!', null],
    ['blank personNumber', { plan: PLAN, personNumber: '  ', RequestID: '203' }, 400, 'Missing Person Number!', null],
    ['empty body', {}, 400, 'Missing RequestID, Person Number!', null],
    ['missing plan', { personNumber: '123', RequestID: '201' }, 200, 'Request has been received Successfully', 'Missing Plan!'],
    ['unknown plan', { plan: 'KSA Travel', personNumber: '123', RequestID: '202' }, 200, 'Request has been received Successfully', 'Invalid plan name: KSA Travel'],
];

for (const [name, body, expectedStatus, expectedMessage, expectedFailure] of VALIDATION_CASES) {
    test(`validation: ${name}`, async () => {
        const { status, json } = await post(body);
        await waitFor(100);

        assert.equal(status, expectedStatus);
        assert.equal(json.message, expectedMessage);
        assert.equal(browsersLaunched, 0, 'no browser should be launched');
        if (expectedFailure) {
            assert.deepEqual(notifications.map(n => [n.status, n.message]), [['Failed', expectedFailure]]);
        } else {
            assert.equal(notifications.length, 0);
        }
    });
}

test('GET /check still answers', async () => {
    const response = await fetch(`${server.url}/check`);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'Welcome to the Automation API');
});

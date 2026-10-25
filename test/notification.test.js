const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
require('./helpers');   // quiet logger

// A tiny stand-in for Apigee: POST /token and POST /notification
const apigee = {
    tokenRequests: [],
    notifications: [],
    nextNotificationStatus: [],   // statuses to return, in order; 200 when empty
};
let server;
let HandleResponse;

before(async () => {
    server = http.createServer((req, res) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            if (req.url === '/token') {
                apigee.tokenRequests.push({ authorization: req.headers.authorization, body });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ access_token: `token-${apigee.tokenRequests.length}`, expires_in: 1800 }));
            }
            if (req.url === '/notification') {
                apigee.notifications.push({ headers: req.headers, body: JSON.parse(body) });
                const status = apigee.nextNotificationStatus.shift() || 200;
                res.writeHead(status, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify(status === 200 ? { ok: true } : { code: status, reason: 'test', message: 'test error' }));
            }
            res.writeHead(404);
            res.end();
        });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;

    // The module reads these when it is loaded
    process.env.APIGEE_NOTIFICATION_URL = `${base}/notification`;
    process.env.APIGEE_TOKEN_URL = `${base}/token`;
    process.env.APIGEE_API_KEY = 'test-key';
    process.env.APIGEE_API_SECRET = 'test-secret';
    HandleResponse = require('../Utils/MendixNotification');
});

after(() => new Promise(resolve => server.close(resolve)));

beforeEach(() => {
    apigee.notifications.length = 0;
    apigee.nextNotificationStatus.length = 0;
});

test('sends the camelCase body the proxy expects, with x-api-key and Bearer token', async () => {
    const result = await HandleResponse('KSA Overtime Request', 123, 456, 'Success', 'Done');

    assert.deepEqual(result, { ok: true });
    const { headers, body } = apigee.notifications[0];
    assert.equal(headers['x-api-key'], 'test-key');
    assert.match(headers.authorization, /^Bearer token-\d+$/);
    assert.deepEqual(Object.keys(body).sort(), ['employeeID', 'message', 'plan', 'requestID', 'status', 'updatedDate']);
    assert.equal(body.plan, 'KSA Overtime Request');
    assert.equal(body.employeeID, '123');
    assert.equal(body.requestID, '456');
    assert.equal(body.status, 'Success');
    assert.equal(body.message, 'Done');
    assert.ok(!Number.isNaN(Date.parse(body.updatedDate)));
});

test('token request uses Basic key:secret and client_credentials', () => {
    const first = apigee.tokenRequests[0];
    assert.equal(first.authorization, 'Basic ' + Buffer.from('test-key:test-secret').toString('base64'));
    assert.equal(first.body, 'grant_type=client_credentials');
});

test('reuses the cached token, and fetches it only once for parallel calls', async () => {
    const tokensBefore = apigee.tokenRequests.length;
    await Promise.all([1, 2, 3].map(i => HandleResponse('P', i, i, 'Success', '')));

    assert.equal(apigee.notifications.length, 3);
    assert.equal(apigee.tokenRequests.length, tokensBefore);
});

test('on 401 gets a new token and retries once', async () => {
    const tokensBefore = apigee.tokenRequests.length;
    apigee.nextNotificationStatus.push(401);

    const result = await HandleResponse('P', 1, 2, 'Success', '');

    assert.deepEqual(result, { ok: true });
    assert.equal(apigee.notifications.length, 2);
    assert.equal(apigee.tokenRequests.length, tokensBefore + 1);
    assert.notEqual(apigee.notifications[0].headers.authorization, apigee.notifications[1].headers.authorization);
});

test('returns null instead of throwing on an error response', async () => {
    apigee.nextNotificationStatus.push(400);
    assert.equal(await HandleResponse('P', 1, 2, 'Failed', 'x'), null);
});

test('message defaults to an empty string', async () => {
    await HandleResponse('P', 1, 2, 'Failed', undefined);
    assert.equal(apigee.notifications[0].body.message, '');
});

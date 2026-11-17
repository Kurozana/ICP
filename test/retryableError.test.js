const { test } = require('node:test');
const assert = require('node:assert/strict');
const { TargetCloseError, ProtocolError } = require('puppeteer');

const { getRetryReason, isRetryableBrowserError } = require('../Utils/retryableError');
const AutomationError = require('../Utils/CustomError');

const RETRYABLE = [
    ['detached node', new Error('Node is detached from document')],
    ['different letter case', new Error('node is DETACHED from document')],
    ['not clickable', new Error('Node is either not clickable or not an Element')],
    ['detached frame', new Error('Attempted to use detached Frame 1A2B.')],
    ['TargetCloseError', new TargetCloseError('Protocol error (Runtime.callFunctionOn): Target closed')],
    ['ProtocolError: session closed', new ProtocolError('Session closed. Most likely the page has been closed.')],
];

const NOT_RETRYABLE = [
    ['other ProtocolError', new ProtocolError('Protocol error: Invalid parameters')],
    ['selector timeout', new Error('Waiting for selector `#x` failed')],
    ['AutomationError, even with "detached" text', new AutomationError('Node is detached from document', 'P', '1', '2')],
    ['null', null],
    ['error without message', Object.assign(new Error(), { message: undefined })],
];

for (const [name, error] of RETRYABLE) {
    test(`retries: ${name}`, () => {
        assert.ok(getRetryReason(error));
        assert.equal(isRetryableBrowserError(error), true);
    });
}

for (const [name, error] of NOT_RETRYABLE) {
    test(`does not retry: ${name}`, () => {
        assert.equal(getRetryReason(error), null);
        assert.equal(isRetryableBrowserError(error), false);
    });
}

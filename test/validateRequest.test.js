const { test } = require('node:test');
const assert = require('node:assert/strict');

const validateRequest = require('../Utils/validateRequest');
const requestTypes = require('../RequestTypes');

const PLAN = 'KSA Overtime Request';

const CASES = [
    ['valid, strings as Mendix sends them', { plan: PLAN, personNumber: '1480', RequestID: '4722' }, { result: 'ok' }],
    ['valid, IDs as numbers', { plan: PLAN, personNumber: 123, RequestID: 456 }, { result: 'ok' }],
    ['missing RequestID', { plan: PLAN, personNumber: '123' }, { result: 'reject', message: 'Missing RequestID!' }],
    ['non-digit IDs are accepted', { plan: PLAN, personNumber: 'EMP-12', RequestID: 'REQ-1' }, { result: 'ok' }],
    ['personNumber blank', { plan: PLAN, personNumber: '  ', RequestID: '456' }, { result: 'reject', message: 'Missing Person Number!' }],
    ['RequestID null', { plan: PLAN, personNumber: '1480', RequestID: null }, { result: 'reject', message: 'Missing RequestID!' }],
    ['empty body', {}, { result: 'reject', message: 'Missing RequestID, Person Number!' }],
    ['no body', undefined, { result: 'reject', message: 'Missing RequestID, Person Number!' }],
    ['missing plan', { personNumber: '123', RequestID: '456' }, { result: 'fail', message: 'Missing Plan!' }],
    ['unknown plan', { plan: 'KSA Travel', personNumber: '123', RequestID: '456' }, { result: 'fail', message: 'Invalid plan name: KSA Travel' }],
    ['plan "__proto__"', { plan: '__proto__', personNumber: '123', RequestID: '456' }, { result: 'fail', message: 'Invalid plan name: __proto__' }],
];

for (const [name, body, expected] of CASES) {
    test(name, () => {
        assert.deepEqual(validateRequest(body, requestTypes), expected);
    });
}

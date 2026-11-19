// What happens after the bot clicks OK on the award dialog.
const { test } = require('node:test');
const assert = require('node:assert');
require('./helpers'); // quiet logger
const awardCompensation = require('../Pages/AwardCompensationPage');
const AutomationError = require('../Utils/CustomError');

const plan = 'KSA Business Trip Request';
const requestTypes = { [plan]: async () => {} };

// A page where every action succeeds; the wait after OK returns `outcome` (or times out when it is 'timeout')
function pageAfterOk(outcome) {
    return new Proxy({}, {
        get: (target, key) => {
            if (key === 'then') return undefined;
            if (key === 'waitForFunction') {
                return async () => {
                    if (outcome === 'timeout') throw new Error('Waiting failed: 60000ms exceeded');
                    return { jsonValue: async () => outcome };
                };
            }
            return async () => null;
        },
    });
}

const run = (page) => awardCompensation(page, null, {}, null, plan, '1167', '11430', null, requestTypes);

test('Fusion rejects the award: its message is reported as an AutomationError', async () => {
    const message = 'ORA-20001: The data type DATE of parameter DEPARTURE_TIME_1 doesn\'t match the data type TEXT used in the formula.';
    await assert.rejects(run(pageAfterOk({ error: message })), (err) => {
        assert.ok(err instanceof AutomationError);
        assert.strictEqual(err.message, message);
        assert.strictEqual(err.RequestID, '11430');
        return true;
    });
});

test('Fusion accepts the award (dialog closed): no error', async () => {
    await run(pageAfterOk({ closed: true }));
});

test('Fusion never answers: a clear AutomationError instead of a later Continue timeout', async () => {
    await assert.rejects(run(pageAfterOk('timeout')), (err) => {
        assert.ok(err instanceof AutomationError);
        assert.match(err.message, /dialog stayed open after OK/);
        return true;
    });
});

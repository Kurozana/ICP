const { test } = require('node:test');
const assert = require('node:assert/strict');
const { fakePage, fakeBrowser } = require('./helpers');

const requestTypes = require('../RequestTypes');
const Scenario = require('../Pages/Scenario');
const awardCompensation = require('../Pages/AwardCompensationPage');
const AutomationError = require('../Utils/CustomError');

// Plan names exactly as Mendix sends them -> request type file
const EXPECTED = {
    'IND Communication Allowance': 'IND Communication Allowance',
    'IND Overtime Request': 'IND Overtime Request',
    'IND Business Trip': 'IND Business Trip Request',
    'KSA Business Trip Request': 'KSA Business Trip Request',
    'KSA Communication allowance': 'KSA Communication allowance',
    'KSA Overtime Request': 'KSA Overtime Request',
    'KSA School Support Program': 'KSA School Support Program',
    'UAE Business Trip Request': 'UAE Business Trip Request',
    'UAE Communication Allowance': 'UAE Communication Allowance',
    'UAE Overtime Request': 'UAE Overtime Request',
    'UAE School Support Program': 'UAE School Support Program',
};

test('map has exactly the 11 plan names Mendix sends', () => {
    assert.deepEqual(Object.keys(requestTypes).sort(), Object.keys(EXPECTED).sort());
});

for (const [plan, file] of Object.entries(EXPECTED)) {
    test(`'${plan}' maps to RequestTypes/${file}.js`, () => {
        assert.equal(typeof requestTypes[plan], 'function');
        assert.equal(requestTypes[plan], require(`../RequestTypes/${file}`));
    });

    test(`Scenario('${plan}') calls its request type with the right arguments`, async () => {
        const page = fakePage();
        const browser = fakeBrowser();
        const body = { plan, personNumber: '123', RequestID: '456' };
        const HandleResponse = () => {};
        let called = null;
        let loginArgs = null;
        const spies = Object.fromEntries(Object.keys(EXPECTED).map(name => [name, async (...args) => { called = { name, args }; }]));

        await Scenario('RES', body, page, browser, 'user', 'pass', 'URL',
            async (...args) => { loginArgs = args; }, async () => {}, awardCompensation, HandleResponse, spies);

        assert.equal(called.name, plan);
        assert.deepEqual(called.args, [browser, page, body, 'RES', plan, '123', '456', HandleResponse]);
        assert.deepEqual(loginArgs, [page, 'URL', 'user', 'pass']);
    });
}

for (const plan of ['Unknown Plan', 'toString', '__proto__']) {
    test(`plan '${plan}' is rejected with "Invalid plan name"`, async () => {
        await assert.rejects(
            awardCompensation(fakePage(), fakeBrowser(), {}, 'RES', plan, '1', '2', () => {}, requestTypes),
            (error) => error instanceof AutomationError && error.message === 'Invalid plan name: ' + plan
        );
    });
}

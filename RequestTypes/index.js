// Plan name (exactly as Mendix sends it) -> request type automation.
// Every function is called as fn(browser, page, body, res, plan, personNumber, RequestID, HandleResponse).
const requestTypes = {
    'IND Communication Allowance': require('./IND Communication Allowance'),
    'IND Overtime Request': require('./IND Overtime Request'),
    'IND Business Trip': require('./IND Business Trip Request'),
    'KSA Business Trip Request': require('./KSA Business Trip Request'),
    'KSA Communication allowance': require('./KSA Communication allowance'),
    'KSA Overtime Request': require('./KSA Overtime Request'),
    'KSA School Support Program': require('./KSA School Support Program'),
    'UAE Business Trip Request': require('./UAE Business Trip Request'),
    'UAE Communication Allowance': require('./UAE Communication Allowance'),
    'UAE Overtime Request': require('./UAE Overtime Request'),
    'UAE School Support Program': require('./UAE School Support Program'),
};

module.exports = requestTypes;

// Checks an /automate-login body before a browser is launched.
// personNumber and RequestID are kept as Mendix sends them (strings like "1480"); only presence is checked.
// Returns one of:
//   { result: 'reject', message }  RequestID/personNumber missing or blank: answer 400, a notification can't be matched
//   { result: 'fail', message }    plan missing or unknown: answer 200 and send a Failed notification right away
//   { result: 'ok' }
function validateRequest(body, requestTypes) {
    const { personNumber, plan, RequestID } = body || {};

    const missing = [];
    for (const [label, value] of [['RequestID', RequestID], ['Person Number', personNumber]]) {
        const text = value === undefined || value === null ? '' : String(value).trim();
        if (!text) missing.push(label);
    }
    if (missing.length > 0) {
        return { result: 'reject', message: `Missing ${missing.join(', ')}!` };
    }

    if (!plan) {
        return { result: 'fail', message: 'Missing Plan!' };
    }
    if (!Object.prototype.hasOwnProperty.call(requestTypes, plan)) {
        return { result: 'fail', message: 'Invalid plan name: ' + plan };
    }

    return { result: 'ok' };
}

module.exports = validateRequest;

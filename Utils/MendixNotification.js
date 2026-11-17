const axios = require('axios');
const log = require('./log');

//env variables
const NOTIFICATION_URL = process.env.APIGEE_NOTIFICATION_URL;   // https://apigee-dev.bahri.sa/v1/api/mendix/icp/notification
const TOKEN_URL = process.env.APIGEE_TOKEN_URL;              // https://apigee-dev.bahri.sa/token-management/v1/token
const API_KEY = process.env.APIGEE_API_KEY;                  // app key: sent as x-api-key AND used as client id for the token
const API_SECRET = process.env.APIGEE_API_SECRET;            // the same app's secret, only for the token request

// ---- Apigee application token (client credentials), cached until ~60 s before it expires ----
let cachedToken = null;
let tokenExpiresAt = 0;
let pendingToken = null;   // one token request at a time, even if many notifications are sent together

async function getAccessToken(forceNew = false) {
    if (!forceNew && cachedToken && Date.now() < tokenExpiresAt - 60_000) {
        return cachedToken;
    }
    if (!pendingToken) {
        pendingToken = axios.post(
            TOKEN_URL,
            new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
            {
                auth: { username: API_KEY, password: API_SECRET },   // Authorization: Basic base64(key:secret)
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
                timeout: 15_000,
            }
        ).then(res => {
            cachedToken = res.data.access_token;
            tokenExpiresAt = Date.now() + Number(res.data.expires_in || 1800) * 1000;   // 30 minutes
            return cachedToken;
        }).finally(() => { pendingToken = null; });
    }
    return pendingToken;
}

//Mendix post API Handling (via Apigee icp-notification proxy)
async function HandleResponse(Plan, EmployeeID, RequestID, Status, Message) {
    // Field names and formats required by the proxy's specification (anything else is refused with 400):
    // plan and status required; employeeID and requestID digits only, sent as strings; updatedDate ISO 8601.
    const payload = {
        plan: String(Plan),
        employeeID: String(EmployeeID),
        status: String(Status),
        updatedDate: new Date().toISOString(),
        requestID: String(RequestID),
        message: String(Message ?? ''),
    };
    log.info('Notification payload', { payload });

    const send = async (forceNewToken) => axios.post(NOTIFICATION_URL, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': API_KEY,
            'Authorization': `Bearer ${await getAccessToken(forceNewToken)}`,
        },
        timeout: 30_000,
    });

    try {
        let response;
        try {
            response = await send(false);
        } catch (err) {
            // Token expired or revoked before our clock said so: get a new one and retry once
            if (err.response && err.response.status === 401) {
                response = await send(true);
            } else {
                throw err;
            }
        }
        if (response.status >= 200 && response.status < 300) {
            log.info('Notification sent', { response: response.data });
        }
        return response.data;
    } catch (error) {
        if (error.response) {
            // Apigee standard error body: { code, reason, message }
            log.error('Notification error', { status: error.response.status, response: error.response.data });
        } else {
            log.error(`Error sending notification: ${error.message}`);
        }
        return null;
    }
}

module.exports = HandleResponse;

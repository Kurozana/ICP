const { TargetCloseError, ProtocolError } = require('puppeteer');
const AutomationError = require('./CustomError');

// Puppeteer messages that mean the page/DOM changed under us; a fresh page usually fixes it.
// If Puppeteer rewords one of these, update it here (matched case-insensitively).
const RETRYABLE_MESSAGES = [
    'Node is detached from document',
    'Node is either not clickable or not an Element',
    'detached Frame',
];

// ProtocolError messages about a target/session that went away
const RETRYABLE_PROTOCOL_PATTERN = /detached|closed|not attached|no target/i;

// Returns why the error is worth one retry with a new page, or null if it is not
function getRetryReason(error) {
    if (!error || error instanceof AutomationError) return null;   // business failures go straight to Failed

    if (error instanceof TargetCloseError || error.name === 'TargetCloseError') {
        return 'TargetCloseError';
    }

    const message = String(error.message || '');

    if ((error instanceof ProtocolError || error.name === 'ProtocolError') && RETRYABLE_PROTOCOL_PATTERN.test(message)) {
        return 'ProtocolError: target detached or closed';
    }

    const lower = message.toLowerCase();
    const matched = RETRYABLE_MESSAGES.find(text => lower.includes(text.toLowerCase()));
    return matched ? `message: "${matched}"` : null;
}

function isRetryableBrowserError(error) {
    return getRetryReason(error) !== null;
}

module.exports = { getRetryReason, isRetryableBrowserError };

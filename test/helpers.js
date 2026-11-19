// Shared test helpers: quiet logger, fake Puppeteer page/browser, and loading index.js with stubbed modules.
const Module = require('module');
const path = require('path');

const root = path.join(__dirname, '..');

// Keep test output readable
require('../Utils/log').silent = true;

// A page where every action succeeds immediately and Oracle's error dialogs (msgDlg) are never found
function fakePage() {
    return new Proxy({}, {
        get: (target, key) => {
            if (key === 'then') return undefined;
            if (key === 'isClosed') return () => false;
            if (key === 'setDefaultTimeout' || key === 'setDefaultNavigationTimeout') return () => {};
            if (key === 'waitForSelector') {
                return async (selector) => {
                    if (String(selector).includes('msgDlg')) throw new Error('timeout');
                    return true;
                };
            }
            // Fusion accepts every award: the wait after OK reports the dialog as closed
            if (key === 'waitForFunction') return async () => ({ jsonValue: async () => ({ closed: true }) });
            return async () => null;
        },
    });
}

function fakeBrowser() {
    return {
        newPage: async () => fakePage(),
        cookies: async () => [],
        deleteCookie: async () => {},
        pages: async () => [],
        isConnected: () => false,
        close: async () => {},
        process: () => null,
    };
}

// Requires index.js with some of its dependencies replaced.
// stubs: { [request as written in index.js]: value }
function loadAppWith(stubs) {
    const indexPath = require.resolve(path.join(root, 'index.js'));
    delete require.cache[indexPath];

    const originalLoad = Module._load;
    Module._load = function (request, parent, isMain) {
        if (parent && parent.filename === indexPath && Object.prototype.hasOwnProperty.call(stubs, request)) {
            return stubs[request];
        }
        return originalLoad.call(this, request, parent, isMain);
    };
    try {
        return require(indexPath);
    } finally {
        Module._load = originalLoad;
    }
}

// Starts an Express app on a free port; returns { url, close }
function listen(app) {
    return new Promise(resolve => {
        const server = app.listen(0, () => {
            resolve({
                url: `http://127.0.0.1:${server.address().port}`,
                close: () => new Promise(done => server.close(done)),
            });
        });
    });
}

const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = { root, fakePage, fakeBrowser, loadAppWith, listen, waitFor };

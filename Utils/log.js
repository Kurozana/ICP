const { Logger } = require('./Logger');

// One shared logger instance (JSON lines with timestamp) for the whole app
const log = Logger.newLogger();

module.exports = log;

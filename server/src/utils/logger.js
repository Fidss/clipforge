function log(level, message, ...args) {
    console.log(`[${new Date().toISOString()}] [${level}] ${message}`, ...args);
}
module.exports = {
    info: (m, ...a) => log('INFO', m, ...a),
    error: (m, ...a) => log('ERROR', m, ...a),
    warn: (m, ...a) => log('WARN', m, ...a),
    debug: (m, ...a) => log('DEBUG', m, ...a)
};

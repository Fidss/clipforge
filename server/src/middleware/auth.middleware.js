const supabase = require('../database/supabase');

async function requireAuth(req, res, next) {
    // Auth disabled per user request
    next();
}

module.exports = { requireAuth };

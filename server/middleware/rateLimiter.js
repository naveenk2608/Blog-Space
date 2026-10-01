const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

// Stops password guessing: 10 failed logins per account and IP every 15 minutes.
// Successful logins don't count toward the limit.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { msg: 'Too many failed login attempts. Please try again in 15 minutes.' },
  // Keyed by account as well as IP: behind a proxy (e.g. Render) every request can share
  // the proxy's IP, and one attacker must not lock everyone out. Accents are stripped
  // because MySQL matches usernames and emails accent-insensitively.
  keyGenerator: (req) => {
    const identifier = typeof req.body?.emailOrUsername === 'string' ? req.body.emailOrUsername : '';
    const account = identifier.normalize('NFKD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
    return `${ipKeyGenerator(req.ip)}:${account}`;
  },
  // A shared proxy IP is expected here (see above), so skip the warning about it
  validate: { xForwardedForHeader: false },
});

module.exports = { loginLimiter };

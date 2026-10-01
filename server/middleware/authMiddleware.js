const jwt = require('jsonwebtoken');

// Returns the user from a valid x-auth-token header, or null
const getTokenUser = (req) => {
  const token = req.header('x-auth-token');
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET).user || null;
  } catch (err) {
    return null;
  }
};

// Sets req.user when a valid token is sent, but lets anonymous requests through
const optionalAuth = (req, res, next) => {
  const user = getTokenUser(req);
  if (user) req.user = user;
  next();
};

// Rejects the request with 401 unless a valid token is sent
const requireAuth = (req, res, next) => {
  const user = getTokenUser(req);
  if (!user) {
    return res.status(401).json({ msg: 'Please log in to continue' });
  }
  req.user = user;
  next();
};

module.exports = { optionalAuth, requireAuth };

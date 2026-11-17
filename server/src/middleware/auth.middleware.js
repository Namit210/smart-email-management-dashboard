const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'omnimail_super_secret_jwt_key_2026';

/**
 * Assistant Auth Middleware
 * Attaches req.user and req.userId to all incoming requests.
 * If a valid Bearer token is present, resolves to that registered assistant.
 * If no token is provided, safely falls back to the demo assistant user.
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.id) {
          const user = await User.findById(decoded.id).select('-password');
          if (user) {
            req.user = user;
            req.userId = user._id;
            return next();
          }
        }
      } catch (err) {
        // Token invalid or expired
      }
    }

    // Public auth routes (register, login) or health checks do not need fallback
    if (req.path === '/login' || req.path === '/register' || req.path === '/health') {
      return next();
    }

    // Fallback for demo mode / unauthenticated queries
    let demoUser = await User.findOne({ email: 'assistant@omnimail.ai' });
    if (!demoUser) {
      demoUser = await User.findOne({ role: 'assistant' });
    }
    if (demoUser) {
      req.user = demoUser;
      req.userId = demoUser._id;
    }
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    next();
  }
}

module.exports = authMiddleware;

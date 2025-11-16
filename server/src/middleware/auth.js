// Authentication Middleware
const { verifyToken, extractTokenFromHeader } = require('../utils/auth');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Middleware to protect routes - requires valid JWT token
 */
const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        error: 'Not authorized - No token provided',
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from token (excluding password)
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Not authorized - User not found or inactive',
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    res.status(401).json({
      error: 'Not authorized - Invalid token',
    });
  }
};

/**
 * Middleware to restrict access to specific roles
 * @param  {...string} roles - Allowed roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Not authorized - Please login',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden - You do not have permission to perform this action',
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is the resource owner
 * Used for routes where users should only access their own resources
 */
const isOwner = (resourceField = 'author') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Not authorized - Please login',
      });
    }

    // Check if user is admin (admins can access all resources)
    if (req.user.role === 'admin') {
      return next();
    }

    // For create operations, automatically set the owner
    if (req.method === 'POST') {
      req.body[resourceField] = req.user._id;
      return next();
    }

    // For update/delete operations, check ownership later in controller
    next();
  };
};

module.exports = {
  protect,
  restrictTo,
  isOwner,
};

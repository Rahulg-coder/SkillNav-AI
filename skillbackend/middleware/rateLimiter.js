const rateLimit = require("express-rate-limit");

const handler = (req, res, next, options) => {
  res.status(options.statusCode).json({
    success: false,
    error: "Too many requests. Please try again later.",
  });
};

const authLimiter = rateLimit({
  windowMs: process.env.AUTH_RATE_LIMIT_WINDOW_MS ? parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) : 15 * 60 * 1000,
  max: process.env.AUTH_RATE_LIMIT_MAX ? parseInt(process.env.AUTH_RATE_LIMIT_MAX) : 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 AI requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

const assessmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 assessment requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

module.exports = {
  authLimiter,
  aiLimiter,
  assessmentLimiter,
};

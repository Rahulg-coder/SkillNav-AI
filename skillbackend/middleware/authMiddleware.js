const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Missing or invalid token format",
      });
    }

    const token = authHeader.split(" ")[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach to request
    req.user = { id: decoded.userId, email: decoded.email };

    // Prevent Spoofing: Check if client supplied a userId that differs from the authenticated user
    const suppliedUserId = req.body?.userId || req.query?.userId;
    
    if (suppliedUserId && suppliedUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You cannot access or modify another user's data",
      });
    }
    
    // Auto-inject the safe ID into req.body and req.query just to be safe
    // Since we already blocked mismatched IDs above, this guarantees fallback 
    // compatibility with controllers that blindly read req.body.userId
    if (req.body) req.body.userId = req.user.id;
    if (req.query) req.query.userId = req.user.id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, error: "Unauthorized: Token expired" });
    }
    return res.status(401).json({ success: false, error: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;

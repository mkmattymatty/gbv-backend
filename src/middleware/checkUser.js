const jwt = require("jsonwebtoken");

const checkUser = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No token provided, continue without authentication
      req.user = null;
      req.userId = null;
      return next();
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.split(" ")[1];

    if (!token) {
      req.user = null;
      req.userId = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.userId = decoded.userId;
    req.user = decoded;

    next();
  } catch (error) {
    // Token is invalid or expired, but we don't block the request
    req.user = null;
    req.userId = null;
    next();
  }
};

module.exports = checkUser;

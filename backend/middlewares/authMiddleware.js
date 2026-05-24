const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {

    // Token from headers
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "No Token Provided",
      });
    }

    // Remove Bearer
    const actualToken = token.replace("Bearer ", "");

    // Verify token
    const decoded = jwt.verify(
      actualToken,
      process.env.JWT_SECRET
    );

    // Store user data
    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid Token",
    });

  }
};

module.exports = authMiddleware;
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {

    // Authorization header read
    const authHeader =
      req.headers.authorization;

    // Header lekapothe
    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // Bearer token split
    const token =
      authHeader.split(" ")[1];

    // JWT verify
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // decoded user info save
    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid token",
    });

  }
};

module.exports = protect;
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  next();
};

module.exports = protect;
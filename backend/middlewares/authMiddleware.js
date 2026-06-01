const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isApprovedVendor = (user) =>
  user?.role === "vendor" && user.isApproved === true && user.approvalStatus === "approved";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token missing.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive. Contact support.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Token invalid.",
    });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });
  }

  next();
};

const requireApprovedVendor = (req, res, next) => {
  if (req.user?.role !== "vendor") {
    return next();
  }

  if (!isApprovedVendor(req.user)) {
    return res.status(403).json({
      success: false,
      code: "VENDOR_APPROVAL_REQUIRED",
      message: "Your vendor account is pending admin approval.",
    });
  }

  next();
};

module.exports = protect;
module.exports.protect = protect;
module.exports.authorizeRoles = authorizeRoles;
module.exports.requireApprovedVendor = requireApprovedVendor;

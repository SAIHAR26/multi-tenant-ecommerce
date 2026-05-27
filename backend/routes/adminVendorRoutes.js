const express = require("express");

const {
  approveVendor,
  getVendorApprovalRequests,
  getVendorDetails,
  rejectVendor,
} = require("../controllers/adminVendorController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }

  next();
};

router.use(protect, adminOnly);

router.get("/pending", getVendorApprovalRequests);
router.get("/:id", getVendorDetails);
router.patch("/:id/approve", approveVendor);
router.patch("/:id/reject", rejectVendor);

module.exports = router;

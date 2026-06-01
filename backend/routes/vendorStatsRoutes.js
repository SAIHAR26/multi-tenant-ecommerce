const express = require("express");
const router = express.Router();

const { getVendorStats } = require("../controllers/vendorStatsController");
const { authorizeRoles, protect, requireApprovedVendor } = require("../middlewares/authMiddleware");

// 🔥 MUST be BEFORE controller
router.get("/", protect, authorizeRoles("vendor"), requireApprovedVendor, getVendorStats);

module.exports = router;

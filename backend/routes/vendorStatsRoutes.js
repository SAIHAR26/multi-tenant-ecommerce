const express = require("express");
const router = express.Router();

const { getVendorStats } = require("../controllers/vendorStatsController");
const protect = require("../middlewares/authMiddleware");

// 🔥 MUST be BEFORE controller
router.get("/", protect, getVendorStats);

module.exports = router;
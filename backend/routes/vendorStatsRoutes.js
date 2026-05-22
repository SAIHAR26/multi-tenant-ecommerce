const express = require("express");

const router = express.Router();

const {
  getVendorStats,
} = require("../controllers/vendorStatsController");

// GET VENDOR STATS
router.get("/", getVendorStats);

module.exports = router;
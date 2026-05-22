const express = require("express");
const { getVendorStats } = require("../controllers/vendorStatsController");

const router = express.Router();

router.get("/stats", getVendorStats);

module.exports = router;

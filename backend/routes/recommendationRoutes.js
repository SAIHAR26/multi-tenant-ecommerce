const express = require("express");

const router = express.Router();

// GET recommendations
router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      recommendations: [],
      message: "Recommendations fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
    });
  }
});

module.exports = router;
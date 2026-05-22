const express = require("express");

const router = express.Router();

const {
  getRecommendations,
} = require("../controllers/recommendationController");

// GET RECOMMENDATIONS
router.get("/", getRecommendations);

module.exports = router;
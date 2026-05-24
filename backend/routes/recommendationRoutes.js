const express = require("express");
const router = express.Router();

const { getRecommendations } = require("../controllers/recommendationController");
const protect = require("../middlewares/authMiddleware");

// Protected route
router.get("/", protect, getRecommendations);

module.exports = router;
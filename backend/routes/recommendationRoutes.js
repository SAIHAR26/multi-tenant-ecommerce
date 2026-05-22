const express = require("express");

const router = express.Router();

const { getRecommendations } = require("../services/recommendationService");

router.get("/:userId", async (req, res) => {
  try {
    const data = await getRecommendations(req.params.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const router = express.Router();

const {
  getRecommendations,
} = require("../controllers/recommendationController");

// GET RECOMMENDATIONS
router.get("/", getRecommendations);


module.exports = router;
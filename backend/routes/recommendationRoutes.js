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

module.exports = router;
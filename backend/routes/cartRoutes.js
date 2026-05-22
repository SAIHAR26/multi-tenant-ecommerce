const express = require("express");
const {
  addToCart,
  getCart,
  removeFromCart,
} = require("../controllers/cartController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protect all cart routes (user must be logged in)
router.use(protect);

// Routes
router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:id", removeFromCart);

module.exports = router;
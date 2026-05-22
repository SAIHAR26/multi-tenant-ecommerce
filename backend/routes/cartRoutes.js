const express = require("express");
const {
  addToCart,
  getCart,
  updateCart,
  deleteCart,
} = require("../controllers/cartController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protect all cart routes
router.use(protect);

// Routes
router.get("/", getCart);           // GET all carts
router.post("/", addToCart);        // ADD to cart
router.put("/:id", updateCart);     // UPDATE cart
router.delete("/:id", deleteCart);  // DELETE cart

module.exports = router;
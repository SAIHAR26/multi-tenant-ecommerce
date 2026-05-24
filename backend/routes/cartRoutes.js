const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cartController");

const protect = require("../middlewares/authMiddleware");

// protect all routes
router.use(protect);

router.post("/", addToCart);
router.get("/", getCart);
router.put("/:id", updateCart);
router.delete("/:id", removeFromCart);

module.exports = router;
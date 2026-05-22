const express = require("express");
const { addToCart, getCart, removeFromCart } = require("../controllers/cartController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:id", removeFromCart);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cartController");

const { authorizeRoles, protect } = require("../middlewares/authMiddleware");

// Protect all routes
router.use(protect, authorizeRoles("customer"));

// Routes
router.get("/", getCart);
router.post("/", addToCart);
router.put("/:id", updateCart);
router.delete("/:id", removeFromCart);

module.exports = router;

const express = require("express");

const router = express.Router();

const { placeOrder } = require("../controllers/orderController");

// Middlewares
const authMiddleware = require("../middlewares/authMiddleware");

const {
  customerOnly,
  adminOnly,
} = require("../middlewares/roleMiddleware");

// Customer only can place order
router.post(
  "/place",
  authMiddleware,
  customerOnly,
  placeOrder
);

module.exports = router;
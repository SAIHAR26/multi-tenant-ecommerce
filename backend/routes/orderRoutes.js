const express = require("express");

const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
} = require("../controllers/orderController");

// Middlewares
const authMiddleware = require("../middlewares/authMiddleware");

const roleMiddleware = require("../middlewares/roleMiddleware");


// Customer Only
router.post(
  "/place",
  authMiddleware,
  roleMiddleware("customer"),
  placeOrder
);


// Customer Orders
router.get(
  "/my-orders",
  authMiddleware,
  roleMiddleware("customer"),
  getMyOrders
);


// Admin Orders
router.get(
  "/all-orders",
  authMiddleware,
  roleMiddleware("admin"),
  getAllOrders
);

module.exports = router;
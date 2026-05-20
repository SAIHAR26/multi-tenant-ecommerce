const express = require("express");

const router = express.Router();

const {
  getOrders,
  createOrder,
  getOrderById,
  deleteOrder,
} = require("../controllers/orderController");

router.get("/", getOrders);

router.post("/", createOrder);

router.get("/:id", getOrderById);

router.delete("/:id", deleteOrder);

module.exports = router;
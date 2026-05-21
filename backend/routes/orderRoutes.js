const express = require("express");

const router = express.Router();

const {
  getOrders,
  createOrder,
  getOrderById,
  deleteOrder,
  exportOrders,
} = require("../controllers/orderController");

router.get("/", getOrders);
router.get("/export", exportOrders);

router.post("/", createOrder);

router.get("/:id", getOrderById);

router.delete("/:id", deleteOrder);

module.exports = router;

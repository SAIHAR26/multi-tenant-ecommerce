const express = require("express");

const router = express.Router();

const {
  createOrder,
  deleteOrder,
  exportOrders,
  getOrderById,
  getOrders,
} = require("../controllers/orderController");

router.get("/export", exportOrders);

router
  .route("/")
  .get(getOrders)
  .post(createOrder);

router
  .route("/:id")
  .get(getOrderById)
  .delete(deleteOrder);

module.exports = router;

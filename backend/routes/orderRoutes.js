const express = require("express");

const router = express.Router();

const {
  createOrder,
  deleteOrder,
  exportOrders,
  getOrderById,
  getOrders,
  updateOrder,
} = require("../controllers/orderController");

router.get("/export", exportOrders);

router
  .route("/")
  .get(getOrders)
  .post(createOrder);

router
  .route("/:id")
  .get(getOrderById)
  .patch(updateOrder)
  .delete(deleteOrder);

module.exports = router;

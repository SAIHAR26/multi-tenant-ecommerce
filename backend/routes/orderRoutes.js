const express = require("express");

const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const {
  createOrder,
  deleteOrder,
  exportOrders,
  getOrderById,
  getOrders,
  updateOrder,
} = require("../controllers/orderController");

router.get("/export", protect, authorizeRoles("admin"), exportOrders);

router
  .route("/")
  .get(protect, getOrders)
  .post(protect, createOrder);

router
  .route("/:id")
  .get(protect, getOrderById)
  .patch(protect, updateOrder)
  .delete(protect, deleteOrder);

module.exports = router;

const express = require("express");

const router = express.Router();
const { protect, authorizeRoles, requireApprovedVendor } = require("../middlewares/authMiddleware");

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
  .get(protect, requireApprovedVendor, getOrders)
  .post(protect, authorizeRoles("customer"), createOrder);

router
  .route("/:id")
  .get(protect, requireApprovedVendor, getOrderById)
  .patch(protect, requireApprovedVendor, updateOrder)
  .delete(protect, authorizeRoles("admin", "customer"), deleteOrder);

module.exports = router;

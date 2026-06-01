const express = require("express");
const { authorizeRoles, protect, requireApprovedVendor } = require("../middlewares/authMiddleware");
const {
  createProduct,
  getAnalytics,
  getDashboard,
  getNotifications,
  getOrders,
  getProducts,
  getRevenue,
  getReviews,
  getStats,
  getStore,
  markNotificationRead,
  deleteProduct,
  updateProduct,
  updateStore,
} = require("../controllers/vendorController");

const router = express.Router();

router.use(protect, authorizeRoles("vendor"));

router.get("/dashboard", requireApprovedVendor, getDashboard);
router.get("/stats", requireApprovedVendor, getStats);
router.get("/products", requireApprovedVendor, getProducts);
router.post("/products", requireApprovedVendor, createProduct);
router.put("/products/:id", requireApprovedVendor, updateProduct);
router.patch("/products/:id", requireApprovedVendor, updateProduct);
router.delete("/products/:id", requireApprovedVendor, deleteProduct);
router.get("/orders", requireApprovedVendor, getOrders);
router.get("/reviews", requireApprovedVendor, getReviews);
router.get("/revenue", requireApprovedVendor, getRevenue);
router.get("/analytics", requireApprovedVendor, getAnalytics);
router.get("/store", getStore);
router.put("/store", requireApprovedVendor, updateStore);
router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", markNotificationRead);

module.exports = router;

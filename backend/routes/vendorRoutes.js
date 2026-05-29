const express = require("express");
const protect = require("../middlewares/authMiddleware");
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
  updateStore,
} = require("../controllers/vendorController");

const router = express.Router();

router.use(protect);

router.get("/dashboard", getDashboard);
router.get("/stats", getStats);
router.get("/products", getProducts);
router.post("/products", createProduct);
router.get("/orders", getOrders);
router.get("/reviews", getReviews);
router.get("/revenue", getRevenue);
router.get("/analytics", getAnalytics);
router.get("/store", getStore);
router.put("/store", updateStore);
router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", markNotificationRead);

module.exports = router;

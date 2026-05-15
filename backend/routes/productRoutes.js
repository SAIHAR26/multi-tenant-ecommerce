const express = require("express");

const router = express.Router();

const {
  getProducts,
  addProduct,
} = require("../controllers/productController");

// Middlewares
const authMiddleware = require("../middlewares/authMiddleware");

const {
  adminOnly,
  vendorOnly,
} = require("../middlewares/roleMiddleware");

// Routes

// Get products
router.get(
  "/",
  authMiddleware,
  getProducts
);

// Add product - Vendor only
router.post(
  "/add",
  authMiddleware,
  vendorOnly,
  addProduct
);

module.exports = router;
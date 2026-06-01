const express = require("express");

const router = express.Router();
const { protect, authorizeRoles, requireApprovedVendor } = require("../middlewares/authMiddleware");

const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  getRecommendations,
} = require("../controllers/recommendationController");

// GET RECOMMENDATIONS
router.get("/recommendations", getRecommendations);

// GET ALL PRODUCTS
router.get("/", getProducts);

// GET PRODUCT BY ID
router.get("/:id", getProductById);

// CREATE PRODUCT
router.post("/", protect, authorizeRoles("admin", "vendor"), requireApprovedVendor, addProduct);

// UPDATE PRODUCT
router.patch("/:id", protect, authorizeRoles("admin", "vendor"), requireApprovedVendor, updateProduct);
router.put("/:id", protect, authorizeRoles("admin", "vendor"), requireApprovedVendor, updateProduct);

// DELETE PRODUCT
router.delete("/:id", protect, authorizeRoles("admin", "vendor"), requireApprovedVendor, deleteProduct);

module.exports = router;

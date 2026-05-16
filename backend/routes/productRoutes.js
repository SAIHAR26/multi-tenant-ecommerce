const express = require("express");

const router = express.Router();

const {
  getProducts,
  addProduct,
} = require("../controllers/productController");

// Middlewares
const authMiddleware = require("../middlewares/authMiddleware");

const {
  vendorOnly,
} = require("../middlewares/roleMiddleware");


// Public route
router.get(
  "/",
  getProducts
);


// Vendor only
router.post(
  "/add",
  authMiddleware,
  vendorOnly,
  addProduct
);

module.exports = router;
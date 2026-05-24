const express = require("express");

const router = express.Router();

const {
  getProducts,
  addProduct,
} = require("../controllers/productController");

// Middlewares
const authMiddleware = require("../middlewares/authMiddleware");

const roleMiddleware = require("../middlewares/roleMiddleware");


// Public Route
router.get(
  "/",
  getProducts
);


// Vendor Only Route
router.post(
  "/add",
  authMiddleware,
  roleMiddleware("vendor"),
  addProduct
);

module.exports = router;
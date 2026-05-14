const express = require("express");

const router = express.Router();

const {
  getProducts,
  addProduct,
} = require("../controllers/productController");


// auth middleware
const protect = require(
  "../middlewares/authMiddleware"
);


// Routes

router.get(
  "/",
  protect,
  getProducts
);

router.post(
  "/add",
  protect,
  addProduct
);

module.exports = router;
const mongoose = require("mongoose");
require("dotenv").config();

// MODELS
const User = require("./models/User");
const Product = require("./models/Product");
const Review = require("./models/Review");
const Store = require("./models/Store");
const Order = require("./models/Order");
const Cart = require("./models/Cart");
const Wishlist = require("./models/Wishlist");

// DB CONNECT
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected ✅");

    // PRODUCT → STORE TEST
    const products = await Product.find()
      .populate("storeId", "storeName location")
      .populate("vendor", "name email");

    console.log("\n========== POPULATED PRODUCTS ==========\n");
    console.log(products);

    // REVIEW → USER + PRODUCT TEST
    const reviews = await Review.find()
      .populate("userId", "name email")
      .populate("productId", "name price");

    console.log("\n========== POPULATED REVIEWS ==========\n");
    console.log(reviews);

    // ORDER → USER + PRODUCTS TEST
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "name price");

    console.log("\n========== POPULATED ORDERS ==========\n");
    console.log(orders);

    // CART → USER + PRODUCTS TEST
    const carts = await Cart.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price");

    console.log("\n========== POPULATED CARTS ==========\n");
    console.log(carts);

    // WISHLIST → USER + PRODUCTS TEST
    const wishlists = await Wishlist.find()
      .populate("userId", "name email")
      .populate("savedProducts", "name price");

    console.log("\n========== POPULATED WISHLISTS ==========\n");
    console.log(wishlists);

    console.log("\n✅ ALL POPULATE TESTS COMPLETED SUCCESSFULLY");

    process.exit();
  })
  .catch((err) => {
    console.log("Database Error:", err);
  });
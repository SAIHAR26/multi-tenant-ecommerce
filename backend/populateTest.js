const mongoose = require("mongoose");
require("dotenv").config();

// IMPORT MODELS
const User = require("./models/User");
const Product = require("./models/Product");
const Review = require("./models/Review");
const Store = require("./models/Store");
const Order = require("./models/Order");
const Cart = require("./models/Cart");
const Wishlist = require("./models/Wishlist");

// CONNECT DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("\n✅ MongoDB Connection Successful\n");

    // ================= PRODUCTS =================
    const productData = await Product.find()
      .populate("storeId", "storeName location")
      .populate("vendor", "name email");

    console.log("============= PRODUCTS WITH STORE & VENDOR =============");
    productData.forEach((product, index) => {
      console.log(`\nProduct ${index + 1}`);
      console.log(product);
    });

    // ================= REVIEWS =================
    const reviewData = await Review.find()
      .populate("userId", "name email")
      .populate("productId", "name price");

    console.log("\n============= REVIEWS WITH USER & PRODUCT =============");
    reviewData.forEach((review, index) => {
      console.log(`\nReview ${index + 1}`);
      console.log(review);
    });

    // ================= ORDERS =================
    const orderData = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "name price");

    console.log("\n============= ORDERS WITH USER & PRODUCTS =============");
    orderData.forEach((order, index) => {
      console.log(`\nOrder ${index + 1}`);
      console.log(order);
    });

    // ================= CARTS =================
    const cartData = await Cart.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price");

    console.log("\n============= CARTS WITH USER & ITEMS =============");
    cartData.forEach((cart, index) => {
      console.log(`\nCart ${index + 1}`);
      console.log(cart);
    });

    // ================= WISHLISTS =================
    const wishlistData = await Wishlist.find()
      .populate("userId", "name email")
      .populate("savedProducts", "name price");

    console.log("\n============= WISHLISTS WITH SAVED PRODUCTS =============");
    wishlistData.forEach((wishlist, index) => {
      console.log(`\nWishlist ${index + 1}`);
      console.log(wishlist);
    });

    console.log("\n🎉 DATABASE RELATIONSHIP TEST COMPLETED SUCCESSFULLY");

    process.exit();
  })
  .catch((error) => {
    console.log("\n❌ Database Connection Failed");
    console.log(error);
  });
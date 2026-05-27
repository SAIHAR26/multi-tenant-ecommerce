const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");

const Cart = require("./models/Cart");
const Order = require("./models/Order");
const Product = require("./models/Product");
const Review = require("./models/Review");
const Wishlist = require("./models/Wishlist");

const printDocs = (title, docs) => {
  console.log(`\n============= ${title} =============`);
  docs.forEach((doc, index) => {
    console.log(`\n${title} ${index + 1}`);
    console.log(doc);
  });
};

const run = async () => {
  await connectDB();
  console.log("\nMongoDB connection successful\n");

  const productData = await Product.find()
    .populate("storeId", "storeName location")
    .populate("vendor", "name email");
  printDocs("PRODUCTS WITH STORE & VENDOR", productData);

  const reviewData = await Review.find()
    .populate("userId", "name email")
    .populate("productId", "name price");
  printDocs("REVIEWS WITH USER & PRODUCT", reviewData);

  const orderData = await Order.find()
    .populate("userId", "name email")
    .populate("products.productId", "name price");
  printDocs("ORDERS WITH USER & PRODUCTS", orderData);

  const cartData = await Cart.find()
    .populate("userId", "name email")
    .populate("items.productId", "name price");
  printDocs("CARTS WITH USER & ITEMS", cartData);

  const wishlistData = await Wishlist.find()
    .populate("userId", "name email")
    .populate("savedProducts", "name price");
  printDocs("WISHLISTS WITH SAVED PRODUCTS", wishlistData);

  console.log("\nDatabase relationship test completed successfully");
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.log("\nDatabase relationship test failed");
  console.log(error);
  await mongoose.disconnect();
  process.exit(1);
});

const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");
const Review = require("./models/Review");
const Store = require("./models/Store");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    // PRODUCT → STORE TEST
    const products = await Product.find().populate("storeId");

    console.log("\nPOPULATED PRODUCTS:\n");
    console.log(products);

    // REVIEW → USER + PRODUCT TEST
    const reviews = await Review.find()
      .populate("userId")
      .populate("productId");

    console.log("\nPOPULATED REVIEWS:\n");
    console.log(reviews);

    process.exit();
  })
  .catch((err) => {
    console.log(err);
  });
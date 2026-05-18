const mongoose = require("mongoose");
require("dotenv").config();

// MODELS
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Review = require("./models/Review");
const Store = require("./models/Store");
const Cart = require("./models/Cart");
const Wishlist = require("./models/Wishlist");
const Payment = require("./models/Payment");

const seedData = async () => {
  try {
    console.log("Seeding started...");

    // CLEAR OLD DATA
    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      Review.deleteMany(),
      Store.deleteMany(),
      Cart.deleteMany(),
      Wishlist.deleteMany(),
      Payment.deleteMany(),
    ]);

    console.log("Old Ecommerce Data Deleted");

    // USERS
    const users = await User.insertMany([
      {
        name: "FashionHub",
        email: "fashionhub@gmail.com",
        password: "123456",
        role: "vendor",
      },
      {
        name: "UrbanWear",
        email: "urbanwear@gmail.com",
        password: "123456",
        role: "vendor",
      },
      {
        name: "Rahul",
        email: "rahul@gmail.com",
        password: "123456",
        role: "customer",
      },
      {
        name: "Sneha",
        email: "sneha@gmail.com",
        password: "123456",
        role: "customer",
      },
    ]);

    const vendor1 = users[0];
    const vendor2 = users[1];
    const customer1 = users[2];
    const customer2 = users[3];

    // STORES
    const stores = await Store.insertMany([
      {
        vendorId: vendor1._id,
        storeName: "Fashion Hub",
        storeDescription: "Best fashion products",
        storeCategory: "Fashion",
        location: "Hyderabad",
      },
      {
        vendorId: vendor2._id,
        storeName: "Urban Wear",
        storeDescription: "Modern clothing collection",
        storeCategory: "Clothing",
        location: "Bangalore",
      },
    ]);

    const store1 = stores[0];
    const store2 = stores[1];

    // PRODUCTS
    const products = await Product.insertMany([
      {
        storeId: store1._id,
        vendor: vendor1._id,
        name: "Formal Shirt",
        description: "Premium cotton shirt",
        price: 999,
        stock: 20,
        category: "Men",
        brand: "FashionHub",
        discount: 10,
        images: [],
        sizes: ["M", "L"],
        colors: ["Blue"],
      },
      {
        storeId: store2._id,
        vendor: vendor2._id,
        name: "Sneakers",
        description: "Comfort running shoes",
        price: 1999,
        stock: 15,
        category: "Footwear",
        brand: "UrbanWear",
        discount: 5,
        images: [],
        sizes: ["8", "9"],
        colors: ["Black"],
      },
    ]);

    const product1 = products[0];
    const product2 = products[1];

    // REVIEWS
    await Review.insertMany([
      {
        userId: customer1._id,
        productId: product1._id,
        rating: 5,
        comment: "Excellent quality",
      },
      {
        userId: customer2._id,
        productId: product2._id,
        rating: 4,
        comment: "Good product",
      },
    ]);

    // CART
    await Cart.insertMany([
      {
        userId: customer1._id,
        items: [
          {
            productId: product1._id,
            quantity: 1,
          },
        ],
      },
      {
        userId: customer2._id,
        items: [
          {
            productId: product2._id,
            quantity: 2,
          },
        ],
      },
    ]);

    // WISHLIST
    await Wishlist.insertMany([
      {
        userId: customer1._id,
        savedProducts: [product2._id],
      },
      {
        userId: customer2._id,
        savedProducts: [product1._id],
      },
    ]);

    // ORDERS
    const orders = await Order.insertMany([
      {
        userId: customer1._id,
        products: [
          {
            productId: product1._id,
            quantity: 1,
          },
        ],
        totalAmount: 999,
        status: "PROCESSING",
        deliveryAddress: "Hyderabad",
        paymentStatus: "PENDING",
      },
    ]);

    const order1 = orders[0];

    // PAYMENTS
    await Payment.insertMany([
      {
        orderId: order1._id,
        method: "COD",
        status: "PENDING",
        transactionId: "",
      },
    ]);

    console.log("Ecommerce Workflow Seed Completed Successfully 🚀");
    process.exit();
  } catch (error) {
    console.log("Seed Error:", error);
    process.exit(1);
  }
};

// DB CONNECT
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    seedData();
  })
  .catch((err) => console.log(err));
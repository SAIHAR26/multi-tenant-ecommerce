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
const Notification = require("./models/Notification");

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
      Notification.deleteMany(),
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
      {
        name: "Kiran",
        email: "kiran@gmail.com",
        password: "123456",
        role: "customer",
      },
      {
        name: "Priya",
        email: "priya@gmail.com",
        password: "123456",
        role: "customer",
      },
    ]);

    const vendor1 = users[0];
    const vendor2 = users[1];
    const customer1 = users[2];
    const customer2 = users[3];
    const customer3 = users[4];
    const customer4 = users[5];

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
        rating: 4.5,
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
        rating: 4,
      },
      {
        storeId: store1._id,
        vendor: vendor1._id,
        name: "Hoodie",
        description: "Winter cotton hoodie",
        price: 1499,
        stock: 25,
        category: "Winter Wear",
        brand: "FashionHub",
        discount: 15,
        images: [],
        sizes: ["M", "L", "XL"],
        colors: ["Grey"],
        rating: 5,
      },
      {
        storeId: store2._id,
        vendor: vendor2._id,
        name: "Jeans",
        description: "Slim fit denim jeans",
        price: 1799,
        stock: 30,
        category: "Clothing",
        brand: "UrbanWear",
        discount: 8,
        images: [],
        sizes: ["30", "32", "34"],
        colors: ["Blue"],
        rating: 4.2,
      },
    ]);

    const product1 = products[0];
    const product2 = products[1];
    const product3 = products[2];
    const product4 = products[3];

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
      {
        userId: customer3._id,
        productId: product3._id,
        rating: 5,
        comment: "Worth the money",
      },
      {
        userId: customer4._id,
        productId: product4._id,
        rating: 4,
        comment: "Fast delivery and nice fit",
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
          {
            productId: product3._id,
            quantity: 2,
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
      {
        userId: customer3._id,
        items: [
          {
            productId: product4._id,
            quantity: 1,
          },
        ],
      },
    ]);

    // WISHLIST
    await Wishlist.insertMany([
      {
        userId: customer1._id,
        savedProducts: [product2._id, product4._id],
      },
      {
        userId: customer2._id,
        savedProducts: [product1._id],
      },
      {
        userId: customer3._id,
        savedProducts: [product3._id],
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
      {
        userId: customer2._id,
        products: [
          {
            productId: product2._id,
            quantity: 2,
          },
        ],
        totalAmount: 3998,
        status: "DELIVERED",
        deliveryAddress: "Bangalore",
        paymentStatus: "PAID",
      },
      {
        userId: customer3._id,
        products: [
          {
            productId: product3._id,
            quantity: 1,
          },
        ],
        totalAmount: 1499,
        status: "SHIPPED",
        deliveryAddress: "Chennai",
        paymentStatus: "PAID",
      },
      {
        userId: customer4._id,
        products: [
          {
            productId: product4._id,
            quantity: 2,
          },
        ],
        totalAmount: 3598,
        status: "PACKED",
        deliveryAddress: "Mumbai",
        paymentStatus: "PENDING",
      },
    ]);

    const order1 = orders[0];
    const order2 = orders[1];
    const order3 = orders[2];
    const order4 = orders[3];

    // PAYMENTS
    await Payment.insertMany([
      {
        orderId: order1._id,
        method: "COD",
        status: "PENDING",
        transactionId: "",
        amount: 999,
      },
      {
        orderId: order2._id,
        method: "NETBANKING",
        status: "SUCCESS",
        transactionId: "TXN123456",
        amount: 3998,
      },
      {
        orderId: order3._id,
        method: "CARD",
        status: "SUCCESS",
        transactionId: "TXN789456",
        amount: 1499,
      },
      {
        orderId: order4._id,
        method: "COD",
        status: "PENDING",
        transactionId: "",
        amount: 3598,
      },
    ]);

    // NOTIFICATIONS
    await Notification.insertMany([
      {
        userId: customer1._id,
        type: "ORDER",
        message: "Your order has been placed successfully",
      },
      {
        userId: customer2._id,
        type: "PAYMENT",
        message: "Payment completed successfully",
      },
      {
        userId: customer3._id,
        type: "ORDER",
        message: "Your order has been shipped",
      },
      {
        userId: customer4._id,
        type: "SYSTEM",
        message: "Your order is out for delivery",
      },
      {
        userId: vendor1._id,
        type: "STORE",
        message: "New order received in your store",
      },
      {
        userId: vendor2._id,
        type: "REVIEW",
        message: "A customer added a new review",
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
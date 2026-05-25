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
const Segment = require("./models/Segment");

/* =========================
   🔥 REUSABLE HELPERS (STEP 5 UPGRADE)
========================= */

const range = (n) => [...Array(n).keys()];

const pick = (arr, i) => arr[i % arr.length];

const PAYMENT_METHODS = ["COD", "CARD", "NETBANKING", "UPI"];
const ORDER_STATUS = ["PROCESSING", "PACKED", "SHIPPED", "DELIVERED"];
const NOTIFICATION_TYPES = ["ORDER", "PAYMENT", "SYSTEM", "REVIEW"];

/* =========================
   MAIN SEED FUNCTION
========================= */

const seedData = async () => {
  try {
    console.log("🚀 Seeding Started...");

    // CLEAN DB
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
      Segment.deleteMany(),
    ]);

    console.log("🧹 Old Data Cleared");

    /* ================= USERS ================= */
    const users = await User.insertMany([
      { name: "Admin", email: "admin@gmail.com", password: "123456", role: "admin" },

      ...range(10).map(i => ({
        name: `Vendor ${i + 1}`,
        email: `vendor${i + 1}@gmail.com`,
        password: "123456",
        role: "vendor",
      })),

      ...range(20).map(i => ({
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@gmail.com`,
        password: "123456",
        role: "customer",
      })),
    ]);

    const vendors = users.filter(u => u.role === "vendor");
    const customers = users.filter(u => u.role === "customer");

    /* ================= STORES ================= */
    const stores = await Store.insertMany(
      vendors.map((v, i) => ({
        vendorId: v._id,
        storeName: `Store ${i + 1}`,
        storeDescription: `Premium Store ${i + 1}`,
        storeCategory: i % 2 ? "Footwear" : "Fashion",
        location: "India",
        totalRevenue: 50000 + i * 3000,
        totalOrders: 100 + i * 5,
        averageRating: 4 + (i % 2),
        growthPercentage: 10 + i,
      }))
    );

    /* ================= PRODUCTS ================= */
    const productNames = [
      "Nike Shoes",
      "Adidas Sneakers",
      "Levi Jeans",
      "Puma T-Shirt",
      "Roadster Shirt",
      "Allen Solly Formal",
      "Wildcraft Bag",
      "Samsung Buds",
      "Apple Watch",
      "RayBan Glasses",
    ];

    const products = await Product.insertMany(
      range(50).map(i => ({
        storeId: stores[i % stores.length]._id,
        vendor: vendors[i % vendors.length]._id,
        name: `${pick(productNames, i)} ${i + 1}`,
        description: "High quality premium product with durability.",
        price: 500 + i * 150,
        stock: 10 + i,
        category: i % 2 ? "Electronics" : "Fashion",
        brand: pick(["Nike", "Apple", "Samsung", "Adidas"], i),
        discount: i % 30,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
        sizes: ["S", "M", "L"],
        colors: ["Black", "White"],
        rating: 4 + (i % 2),
      }))
    );

    /* ================= ORDERS ================= */
    const orders = await Order.insertMany(
      range(30).map(i => ({
        userId: customers[i % customers.length]._id,
        products: [
          {
            productId: products[i]._id,
            quantity: 1 + (i % 2),
          },
        ],
        totalAmount: 800 + i * 200,
        status: pick(ORDER_STATUS, i),
        deliveryAddress: pick(["Hyd", "Bangalore", "Chennai", "Mumbai"], i),
        paymentStatus: i % 2 ? "PENDING" : "PAID",
      }))
    );

    /* ================= PAYMENTS (FIX FIX FIX ✔) ================= */
    await Payment.insertMany(
      orders.map((o, i) => ({
        orderId: o._id,
        method: pick(PAYMENT_METHODS, i),
        status: i % 2 ? "PENDING" : "SUCCESS",
        transactionId: `TXN_${Date.now()}_${i}`,
        amount: o.totalAmount,
      }))
    );

    /* ================= REVIEWS ================= */
    await Review.insertMany(
      range(25).map(i => ({
        userId: customers[i % customers.length]._id,
        productId: products[i]._id,
        rating: 4 + (i % 2),
        comment: "Good product, fast delivery and worth money.",
      }))
    );

    /* ================= CART ================= */
    await Cart.insertMany(
      range(10).map(i => ({
        userId: customers[i]._id,
        items: [
          { productId: products[i]._id, quantity: 1 },
          { productId: products[i + 1]._id, quantity: 2 },
        ],
      }))
    );

    /* ================= WISHLIST ================= */
    await Wishlist.insertMany(
      range(10).map(i => ({
        userId: customers[i]._id,
        savedProducts: [products[i]._id, products[i + 2]._id],
      }))
    );

    /* ================= SEGMENTS ================= */
    await Segment.insertMany([
      {
        name: "VIP Customers",
        description: "High value users",
        users: customers.slice(0, 5).map(u => u._id),
        category: "Premium",
        segmentType: "VIP",
        customerCount: 5,
      },
      {
        name: "Frequent Buyers",
        description: "Regular users",
        users: customers.slice(5, 10).map(u => u._id),
        category: "Shopping",
        segmentType: "FREQUENT",
        customerCount: 5,
      },
    ]);

    /* ================= NOTIFICATIONS ================= */
    await Notification.insertMany(
      range(20).map(i => ({
        userId: customers[i % customers.length]._id,
        type: pick(NOTIFICATION_TYPES, i),
        title: "V SHOP Update",
        message: `Order #${1000 + i} updated successfully`,
        notificationCategory: "order",
        targetRole: "customer",
        sender: "V SHOP",
        preview: "System update",
        isRead: false,
      }))
    );

    /* ================= FINAL ================= */
   console.log("🚀 STEP 5: SEED COMPLETED SUCCESSFULLY");
   console.log("📊 Database seeded with realistic ecommerce data");

    process.exit(0);

  } catch (error) {
    console.log("❌ Seed Error:", error);
    process.exit(1);
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    seedData();
  })
  .catch(err => console.log(err));
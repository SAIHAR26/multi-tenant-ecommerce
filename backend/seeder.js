const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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

    // USERS
    const hashedPassword = await bcrypt.hash("123456", 10);
    const users = await User.insertMany([
      {
        name: "Admin",
        email: "admin@vshop.com",
        password: hashedPassword,
        role: "admin",
        isApproved: true,
        approvalStatus: "approved",
      },
      {
        name: "FashionHub",
        email: "fashionhub@gmail.com",
        password: hashedPassword,
        role: "vendor",
        isApproved: true,
        approvalStatus: "approved",
      },
      {
        name: "UrbanWear",
        email: "urbanwear@gmail.com",
        password: hashedPassword,
        role: "vendor",
        isApproved: true,
        approvalStatus: "approved",
      },
      {
        name: "Rahul",
        email: "rahul@gmail.com",
        password: hashedPassword,
        role: "customer",
      },
      {
        name: "Sneha",
        email: "sneha@gmail.com",
        password: hashedPassword,
        role: "customer",
      },
      {
        name: "Kiran",
        email: "kiran@gmail.com",
        password: hashedPassword,
        role: "customer",
      },
      {
        name: "Priya",
        email: "priya@gmail.com",
        password: hashedPassword,
        role: "customer",
      },
    ]);

    const vendor1 = users[1];
    const vendor2 = users[2];
    const customer1 = users[3];
    const customer2 = users[4];
    const customer3 = users[5];
    const customer4 = users[6];

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
        images: [
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop",
        ],
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
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
        ],
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
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
        ],
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
        images: [
          "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop",
        ],
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
  
  .catch((err) => console.log(err));


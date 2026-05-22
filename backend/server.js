const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

let databaseStatus = "connecting";

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("V SHOP Backend Running");
});

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database: databaseStatus,
    uptime: process.uptime(),
  });
});

// ROUTES IMPORTS
const authRoutes = require("./routes/authRoutes");
const adminVendorRoutes = require("./routes/adminVendorRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const reportRoutes = require("./routes/reportRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const segmentRoutes = require("./routes/segmentRoutes");
const storeRoutes = require("./routes/storeRoutes");
const userRoutes = require("./routes/userRoutes");

// CART ROUTES
const cartRoutes = require("./routes/cartRoutes");

// WISHLIST ROUTES
const wishlistRoutes = require("./routes/wishlistRoutes");

// VENDOR STATS ROUTES
const vendorStatsRoutes = require("./routes/vendorStatsRoutes");

// API ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/admin/vendors", adminVendorRoutes);

app.use("/api/products", productRoutes);

app.use("/api/users", userRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/segments", segmentRoutes);

app.use("/api/store", storeRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/admin/report", reportRoutes);

// CART API
app.use("/api/cart", cartRoutes);

// WISHLIST API
app.use("/api/wishlist", wishlistRoutes);

// VENDOR STATS API
app.use("/api/vendor/stats", vendorStatsRoutes);

// 404 ROUTE HANDLER
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Something went wrong.",
  });
});

// PORT
const PORT = process.env.PORT || 5000;

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// DATABASE CONNECTION
connectDB({ exitOnFailure: false })
  .then(() => {
    databaseStatus = "connected";
  })
  .catch(() => {
    databaseStatus = "disconnected";
  });

// DATABASE EVENTS
mongoose.connection.on("disconnected", () => {
  databaseStatus = "disconnected";
});

mongoose.connection.on("reconnected", () => {
  databaseStatus = "connected";
});
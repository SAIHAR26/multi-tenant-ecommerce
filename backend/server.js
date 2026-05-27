const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

let databaseStatus = "connecting";
let databaseMessage = "";

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const adminVendorRoutes = require("./routes/adminVendorRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const reportRoutes = require("./routes/reportRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const segmentRoutes = require("./routes/segmentRoutes");
const storeRoutes = require("./routes/storeRoutes");
const userRoutes = require("./routes/userRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const vendorStatsRoutes = require("./routes/vendorStatsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

app.get("/", (req, res) => {
  res.send("V SHOP Backend Running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database: databaseStatus,
    message: databaseMessage,
    uptime: process.uptime(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin/vendors", adminVendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products/recommendations", recommendationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/vendor/stats", vendorStatsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/segments", segmentRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin/report", reportRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong.",
  });
});

mongoose.connection.on("disconnected", () => {
  databaseStatus = "disconnected";
});

mongoose.connection.on("reconnected", () => {
  databaseStatus = "connected";
  databaseMessage = "";
});

mongoose.connection.on("connected", () => {
  databaseStatus = "connected";
  databaseMessage = "";
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    databaseStatus = "connected";
    databaseMessage = "";

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    databaseStatus = "disconnected";
    databaseMessage = error.message;
    console.error("Server not started because MongoDB is not connected.");
    process.exit(1);
  }
};

startServer();

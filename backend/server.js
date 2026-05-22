const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
let databaseStatus = "connecting";

app.use(cors());
app.use(express.json());

// ================= ROUTES =================
const authRoutes = require("./routes/authRoutes");
const adminVendorRoutes = require("./routes/adminVendorRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const reportRoutes = require("./routes/reportRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const storeRoutes = require("./routes/storeRoutes");
const userRoutes = require("./routes/userRoutes");

// ✅ RECOMMENDATION ROUTE (NEW ADD)
const recommendationRoutes = require("./routes/recommendationRoutes");

// ================= BASIC ROUTE =================
app.get("/", (req, res) => {
  res.send("V SHOP Backend Running");
});

// ================= HEALTH CHECK =================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database: databaseStatus,
    uptime: process.uptime(),
  });
});

// ================= ROUTE MIDDLEWARE =================
app.use("/api/auth", authRoutes);
app.use("/api/admin/vendors", adminVendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);

// ✅ RECOMMENDATION API
app.use("/api/recommendations", recommendationRoutes);

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong.",
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ================= DB CONNECTION =================
connectDB({ exitOnFailure: false })
  .then(() => {
    databaseStatus = "connected";
  })
  .catch(() => {
    databaseStatus = "disconnected";
  });

mongoose.connection.on("disconnected", () => {
  databaseStatus = "disconnected";
});

mongoose.connection.on("reconnected", () => {
  databaseStatus = "connected";
});
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

let databaseStatus = "connecting";
let databaseMessage = "";

// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());

// ================= ROUTES IMPORT =================

app.use(cors());
app.use(express.json());

// ================= ROUTES =================
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
const wishlistRoutes = require("./routes/wishlistRoutes");
const vendorStatsRoutes = require("./routes/vendorStatsRoutes");
const vendorStatsRoutes = require("./routes/vendorStatsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const cartRoutes = require("./routes/cartRoutes");

// ================= BASIC ROUTES =================

// Root Route
app.get("/", (req, res) => {
  res.send("V SHOP Backend Running");
});

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database: databaseStatus,
    message: databaseMessage,
    uptime: process.uptime(),
  });
});

// ================= API ROUTES =================

app.use("/api/auth", authRoutes);

app.use(
  "/api/admin/vendors",
  adminVendorRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/wishlist",
  wishlistRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

app.use(
  "/api/segments",
  segmentRoutes
);

app.use(
  "/api/store",
  storeRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/vendor/stats",
  vendorStatsRoutes
);

app.use(
  "/api/vendors",
  vendorRoutes
);

app.use(
  "/api/recommendations",
  recommendationRoutes
);

// ================= ERROR HANDLER =================
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

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Something went wrong.",
  });
});

// ================= SERVER START =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});

// ================= DATABASE CONNECTION =================

// ================= DATABASE =================
connectDB({ exitOnFailure: false })
  .then(() => {
    databaseStatus = "connected";
    databaseMessage = "";
  })
  .catch((error) => {
    databaseStatus = "disconnected";
    databaseMessage = error.message;
  });

mongoose.connection.on(
  "disconnected",
  () => {
    databaseStatus = "disconnected";
  }
);

mongoose.connection.on(
  "reconnected",
  () => {
    databaseStatus = "connected";
  }
);
mongoose.connection.on("reconnected", () => {
  databaseStatus = "connected";
  databaseMessage = "";
});

mongoose.connection.on("connected", () => {
  databaseStatus = "connected";
  databaseMessage = "";
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
let databaseStatus = "connecting";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("V SHOP Backend Running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database: databaseStatus,
    uptime: process.uptime(),
  });
});

const authRoutes = require("./routes/authRoutes");
const adminVendorRoutes = require("./routes/adminVendorRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const reportRoutes = require("./routes/reportRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const storeRoutes = require("./routes/storeRoutes");
<<<<<<< HEAD
const notificationRoutes = require("./routes/notificationRoutes");
const reportRoutes = require("./routes/reportRoutes");
=======
const userRoutes = require("./routes/userRoutes");
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8

app.use("/api/auth", authRoutes);
app.use("/api/admin/vendors", adminVendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/notifications", notificationRoutes);
<<<<<<< HEAD
app.use("/api/reports", reportRoutes);
=======
app.use("/api/admin/report", reportRoutes);
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong.",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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

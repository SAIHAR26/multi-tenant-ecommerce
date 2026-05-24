const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

// TEMP: admin check (we will improve later)
const adminOnly = (req, res, next) => {
  next();
};

// APPLY MIDDLEWARE
router.use(protect, adminOnly);

// TEST ROUTE
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Admin/Vendor route working",
  });
});

module.exports = router;
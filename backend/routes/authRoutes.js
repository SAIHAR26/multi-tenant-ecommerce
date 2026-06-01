const express = require("express");

const {
  forgotPassword,
  getCurrentUser,
  registerUser,
  loginUser,
  resetPassword,
} = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

router.get("/me", protect, getCurrentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;

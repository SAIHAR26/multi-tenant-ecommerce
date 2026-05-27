const express = require("express");

const {
  getProfile,
  getUserById,
  getUsers,
  updateProfile,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

// GET ALL USERS
router.get("/", protect, authorizeRoles("admin"), getUsers);

// GET USER PROFILE
router.get("/profile/:id", protect, getProfile);
router.put("/profile/:id", protect, updateProfile);

// GET USER BY ID
router.get("/:id", protect, getUserById);

module.exports = router;

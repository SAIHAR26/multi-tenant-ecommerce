const express = require("express");

const {
  getProfile,
  getUserById,
  getUsers,
} = require("../controllers/userController");

const router = express.Router();

// GET ALL USERS
router.get("/", getUsers);

// GET USER PROFILE
router.get("/profile/:id", getProfile);

// GET USER BY ID
router.get("/:id", getUserById);

module.exports = router;
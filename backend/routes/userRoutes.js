const express = require("express");

const { getProfile, getUserById, getUsers } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.get("/profile", getProfile);
router.get("/:id", getUserById);

module.exports = router;

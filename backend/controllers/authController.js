const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const registerUser = async (req, res) => {
  res.json({
    message: "User Registered"
  });
};

const loginUser = async (req, res) => {
  res.json({
    message: "User Logged In"
  });
};

module.exports = {
  registerUser,
  loginUser
};
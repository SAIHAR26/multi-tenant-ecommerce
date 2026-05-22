const User = require("../models/User");
const Order = require("../models/Order");
const Wishlist = require("../models/Wishlist");

// GET ALL USERS
const getUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message || "Failed to fetch users.",
    });

  }
};

// GET PROFILE
const getProfile = async (req, res) => {

  try {

    const userId = req.params.id;

    // FIND USER
    const user = await User.findById(userId)
      .select("-password");

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    // FIND USER ORDERS
    const orders = await Order.find({
      user: userId,
    });

    // FIND USER WISHLIST
    const wishlist = await Wishlist.findOne({
      userId: userId,
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        orders,
        wishlist,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// GET USER BY ID
const getUserById = async (req, res) => {

  try {

    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {

      return res.status(404).json({
        message: "User not found.",
      });

    }

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message || "Failed to fetch user.",
    });

  }

};

module.exports = {
  getProfile,
  getUserById,
  getUsers,
};
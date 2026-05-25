const User = require("../models/User");
const Order = require("../models/Order");
const Wishlist = require("../models/Wishlist");
const Store = require("../models/Store");

const canAccessUser = (req, userId) =>
  req.user?.role === "admin" || req.user?._id?.toString() === userId;

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

    if (req.user && !canAccessUser(req, userId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

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
      userId,
    }).sort({ createdAt: -1 });

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

// UPDATE PROFILE
const updateProfile = async (req, res) => {

  try {

    const userId = req.params.id;

    if (!canAccessUser(req, userId)) {

      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });

    }

    const allowedFields = ["name", "phone", "location", "age", "avatar"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = field === "age" && req.body[field] !== "" ? Number(req.body[field]) : req.body[field];
      }
    });

    if (req.body.store && (req.user.role === "vendor" || req.user.role === "admin")) {
      const existingStore = req.user.store?.toObject ? req.user.store.toObject() : req.user.store || {};
      updates.store = {
        ...existingStore,
        ...req.body.store,
      };
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    if (user.role === "vendor" && req.body.store) {
      await Store.findOneAndUpdate(
        { vendorId: user._id },
        {
          storeName: req.body.store.name || user.store?.name || user.name,
          storeCategory: req.body.store.category || user.store?.category || "General",
          storeDescription: req.body.store.description || "",
          location: user.location || "",
        },
        { new: true, upsert: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message || "Profile could not be updated.",
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
  updateProfile,
};

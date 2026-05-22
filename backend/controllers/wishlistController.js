const Wishlist = require("../models/Wishlist");

// GET WISHLIST
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find()
      .populate("userId", "name email");

    res.status(200).json({
      success: true,
      count: wishlist.length,
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE WISHLIST
const createWishlist = async (req, res) => {
  try {
    const newWishlist = new Wishlist(req.body);

    const savedWishlist = await newWishlist.save();

    res.status(201).json({
      success: true,
      data: savedWishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE WISHLIST
const deleteWishlist = async (req, res) => {
  try {
    const deletedWishlist = await Wishlist.findByIdAndDelete(
      req.params.id
    );

    if (!deletedWishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  createWishlist,
  deleteWishlist,
};
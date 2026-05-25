const Wishlist = require("../models/Wishlist");

// GET WISHLIST
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id })
      .populate("savedProducts", "name price images");

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      items: wishlist.savedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.user._id,
        savedProducts: [],
      });
    }

    // check duplicate
    if (wishlist.savedProducts.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Already in wishlist",
      });
    }

    wishlist.savedProducts.push(productId);
    await wishlist.save();

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// REMOVE FROM WISHLIST
const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.savedProducts = wishlist.savedProducts.filter(
      (id) => id.toString() !== req.params.id
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
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
  addToWishlist,
  removeFromWishlist,
};
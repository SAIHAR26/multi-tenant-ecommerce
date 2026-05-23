const Product = require("../models/Product");
const Wishlist = require("../models/Wishlist");

const getUserId = (req) => req.user?._id;

// SEND WISHLIST ITEMS
const sendWishlist = async (res, userId) => {
  const wishlist = await Wishlist.findOne({ userId }).populate("savedProducts");

  res.status(200).json({
    success: true,
    items: wishlist?.savedProducts || [],
  });
};

// GET WISHLIST
const getWishlist = async (req, res) => {
  try {
    await sendWishlist(res, getUserId(req));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Unable to load wishlist.",
    });
  }
};

// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
  try {
    const userId = getUserId(req);
    const productId =
      req.body.productId ||
      req.body.product?._id ||
      req.body.product?.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product id is required.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await Wishlist.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: { userId },
        $addToSet: { savedProducts: productId },
      },
      { new: true, upsert: true }
    );

    await sendWishlist(res, userId);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Unable to add item to wishlist.",
    });
  }
};

// REMOVE FROM WISHLIST
const removeFromWishlist = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { savedProducts: id } },
      { new: true }
    );

    await sendWishlist(res, userId);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Unable to remove item from wishlist.",
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
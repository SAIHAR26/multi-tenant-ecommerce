const Product = require("../models/Product");
const Order = require("../models/Order");
const Wishlist = require("../models/Wishlist");

exports.getRecommendations = async (req, res) => {
  try {
    // ✅ SAFE CHECK (prevents crash)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - user missing",
      });
    }

    const userId = req.user._id;

    // Wishlist
    const wishlist = await Wishlist.findOne({ userId });
    const wishlistProducts = wishlist ? wishlist.savedProducts : [];

    // Orders
    const orders = await Order.find({ userId });

    let orderedProducts = [];

    orders.forEach((order) => {
      order.products.forEach((p) => {
        orderedProducts.push(p.productId.toString());
      });
    });

    // Recommendations
    const recommendations = await Product.find({
      _id: { $nin: [...wishlistProducts, ...orderedProducts] },
    }).limit(10);

    return res.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const Product = require("../models/Product");
const Order = require("../models/Order");
const Wishlist = require("../models/Wishlist");

const getCategoryImage = (category) => {
  const images = {
    Accessories: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    Footwear: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    Men: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    Shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    Women: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
  };

  return images[category] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80";
};

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

    const products = await Product.find({
      _id: { $nin: [...wishlistProducts, ...orderedProducts] },
      isActive: true,
    })
      .populate("storeId")
      .sort({ rating: -1, discount: -1, createdAt: -1 })
      .limit(10);

    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 }, averageRating: { $avg: "$rating" } } },
      { $sort: { count: -1, averageRating: -1 } },
      { $limit: 4 },
    ]);

    return res.json({
      success: true,
      products,
      recommendations: products,
      categories: categories.map((category) => ({
        _id: category._id,
        title: category._id || "Recommended",
        reason: "Based on live marketplace signals",
        count: category.count,
        image: getCategoryImage(category._id),
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

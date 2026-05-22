const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");

// GET VENDOR STATS
const getVendorStats = async (req, res) => {

  try {

    // TOTAL PRODUCTS
    const totalProducts = await Product.countDocuments();

    // TOTAL ORDERS
    const totalOrders = await Order.countDocuments();

    // TOTAL REVIEWS
    const totalReviews = await Review.countDocuments();

    // TOTAL REVENUE
    const orders = await Order.find();

    let totalRevenue = 0;

    orders.forEach((order) => {
      totalRevenue += order.totalAmount || 0;
    });

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalReviews,
        totalRevenue,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  getVendorStats,
};
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");


// GET ADMIN REPORT

const getAdminReport = async (req, res) => {

  try {

    // TOTAL USERS

    const totalUsers = await User.countDocuments();


    // TOTAL PRODUCTS

    const totalProducts = await Product.countDocuments();


    // TOTAL ORDERS

    const totalOrders = await Order.countDocuments();


    // TOTAL REVENUE

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );


    // RECENT ORDERS

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email");


    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
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
  getAdminReport,
};
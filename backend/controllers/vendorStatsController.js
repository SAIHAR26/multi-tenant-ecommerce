const Order = require("../models/Order");
const Product = require("../models/Product");

exports.getVendorStats = async (req, res) => {
  try {
    // 🔥 SAFE CHECK (THIS PREVENTS CRASH)
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - login required",
      });
    }

    const vendorId = req.user._id;

    const products = await Product.find({ vendor: vendorId });

    const orders = await Order.find({ "products.productId": { $in: products.map((product) => product._id) } })
      .populate("userId", "name email")
      .lean();

    let revenue = 0;
    const customerIds = new Set();

    orders.forEach((order) => {
      if (order.userId?._id) {
        customerIds.add(order.userId._id.toString());
      }

      order.products.forEach((p) => {
        const match = products.find(
          (prod) => prod._id.toString() === p.productId.toString()
        );

        if (match) {
          revenue += match.price * p.quantity;
        }
      });
    });

    res.json({
      success: true,
      stats: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: customerIds.size,
        revenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

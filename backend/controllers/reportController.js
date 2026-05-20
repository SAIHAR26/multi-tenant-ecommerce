const Order = require("../models/Order");
const Product = require("../models/Product");
const Review = require("../models/Review");
const User = require("../models/User");

const getAdminReport = async (req, res) => {
  try {
    const [
      revenueResult,
      totalOrders,
      totalVendors,
      totalCustomers,
      topSellingProducts,
      recentOrders,
      pendingVendorApprovals,
      reviewsResult,
    ] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),
      Order.countDocuments(),
      User.countDocuments({ role: "vendor" }),
      User.countDocuments({ role: "customer" }),
      Order.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            sold: { $sum: "$products.quantity" },
          },
        },
        { $sort: { sold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            productId: "$_id",
            name: { $ifNull: ["$product.name", "Unknown product"] },
            category: "$product.category",
            sold: 1,
            revenue: { $multiply: ["$sold", { $ifNull: ["$product.price", 0] }] },
          },
        },
      ]),
      Order.find()
        .populate("userId", "name email")
        .populate("products.productId", "name")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      User.countDocuments({ role: "vendor", isActive: false }),
      Review.aggregate([
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
            lowRatingReviews: {
              $sum: {
                $cond: [{ $lte: ["$rating", 2] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    const productFallback =
      topSellingProducts.length > 0
        ? topSellingProducts
        : await Product.find()
            .sort({ rating: -1, stock: -1 })
            .limit(5)
            .select("name category rating price stock")
            .lean();

    res.status(200).json({
      generatedAt: new Date().toISOString(),
      summary: {
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
        totalOrders,
        totalVendors,
        totalCustomers,
        pendingVendorApprovals,
      },
      topSellingProducts: productFallback.map((product) => ({
        name: product.name,
        category: product.category || "General",
        sold: product.sold || 0,
        revenue: product.revenue || 0,
        rating: product.rating,
        stock: product.stock,
        price: product.price,
      })),
      recentOrders: recentOrders.map((order) => ({
        id: order._id,
        customer: order.userId?.name || "Unknown customer",
        email: order.userId?.email || "",
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        products: order.products.map((item) => ({
          name: item.productId?.name || "Unknown product",
          quantity: item.quantity,
        })),
      })),
      reviewsSummary: {
        totalReviews: reviewsResult[0]?.totalReviews || 0,
        averageRating: Number((reviewsResult[0]?.averageRating || 0).toFixed(1)),
        lowRatingReviews: reviewsResult[0]?.lowRatingReviews || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to generate report.",
    });
  }
};

module.exports = {
  getAdminReport,
};

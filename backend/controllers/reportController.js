const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Store = require("../models/Store");
const User = require("../models/User");
const { notifyAdmins } = require("../services/notificationService");

const getDateRange = (daysAgo = 0) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date;
};

const getGrowthPercent = (current, previous) => {
  if (!previous && !current) return 0;
  if (!previous) return 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const getAdminReport = async (req, res) => {
  try {
    const today = getDateRange();
    const weekStart = getDateRange(6);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      revenueResult,
      revenueTodayResult,
      revenueWeekResult,
      revenueMonthResult,
      revenuePreviousMonthResult,
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      refundRequests,
      totalVendors,
      approvedVendors,
      rejectedVendors,
      pendingVendors,
      totalCustomers,
      activeCustomers,
      newCustomers,
      repeatCustomersResult,
      totalProducts,
      activeProducts,
      outOfStockProducts,
      lowStockProducts,
      totalPayments,
      unreadNotifications,
      topSellingProducts,
      recentOrders,
      pendingVendorApprovals,
      reviewsResult,
      revenueTrend,
      orderTrend,
      vendorHealth,
    ] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([{ $match: { createdAt: { $gte: today } } }, { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: weekStart } } }, { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: monthStart } } }, { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }]),
      Order.aggregate([
        { $match: { createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd } } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ["PROCESSING", "PACKED", "SHIPPED"] } }),
      Order.countDocuments({ status: "DELIVERED" }),
      Order.countDocuments({ status: "CANCELLED" }),
      Order.countDocuments({ status: "CANCELLED", paymentStatus: "PAID" }),
      User.countDocuments({ role: "vendor" }),
      User.countDocuments({ role: "vendor", approvalStatus: "approved" }),
      User.countDocuments({ role: "vendor", approvalStatus: "rejected" }),
      User.countDocuments({ role: "vendor", approvalStatus: "pending" }),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "customer", isActive: true }),
      User.countDocuments({ role: "customer", createdAt: { $gte: monthStart } }),
      Order.aggregate([{ $group: { _id: "$userId", orders: { $sum: 1 } } }, { $match: { orders: { $gt: 1 } } }, { $count: "count" }]),
      Product.countDocuments(),
      Product.countDocuments({ isActive: true, status: "Live" }),
      Product.countDocuments({ stock: { $lte: 0 } }),
      Product.countDocuments({ $expr: { $and: [{ $gt: ["$stock", 0] }, { $lte: ["$stock", "$lowStockThreshold"] }] } }),
      Payment.countDocuments(),
      require("../models/Notification").countDocuments({ isRead: false }),
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
      User.countDocuments({ role: "vendor", approvalStatus: "pending" }),
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
            positiveReviews: {
              $sum: {
                $cond: [{ $gte: ["$rating", 4] }, 1, 0],
              },
            },
          },
        },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: weekStart } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: weekStart } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Store.find().sort({ totalRevenue: -1, createdAt: -1 }).limit(5).select("storeName totalRevenue totalOrders averageRating").lean(),
    ]);

    const productFallback =
      topSellingProducts.length > 0
        ? topSellingProducts
        : await Product.find()
            .sort({ rating: -1, stock: -1 })
            .limit(5)
            .select("name category rating price stock")
            .lean();

    const response = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
        revenueToday: revenueTodayResult[0]?.totalRevenue || 0,
        revenueThisWeek: revenueWeekResult[0]?.totalRevenue || 0,
        revenueThisMonth: revenueMonthResult[0]?.totalRevenue || 0,
        revenueGrowthPercent: getGrowthPercent(
          revenueMonthResult[0]?.totalRevenue || 0,
          revenuePreviousMonthResult[0]?.totalRevenue || 0
        ),
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        refundRequests,
        totalVendors,
        approvedVendors,
        pendingVendors,
        rejectedVendors,
        totalCustomers,
        activeCustomers,
        newCustomers,
        repeatCustomers: repeatCustomersResult[0]?.count || 0,
        customerGrowthPercent: totalCustomers
          ? Number((((newCustomers || 0) / totalCustomers) * 100).toFixed(1))
          : 0,
        totalProducts,
        activeProducts,
        outOfStockProducts,
        lowStockProducts,
        totalPayments,
        unreadNotifications,
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
        negativeReviews: reviewsResult[0]?.lowRatingReviews || 0,
        positiveReviews: reviewsResult[0]?.positiveReviews || 0,
      },
      charts: {
        revenueTrend,
        orderTrend,
        vendorHealth: vendorHealth.map((store) => ({
          name: store.storeName,
          revenue: store.totalRevenue || 0,
          orders: store.totalOrders || 0,
          rating: store.averageRating || 0,
        })),
      },
    };

    await notifyAdmins(
      {
        title: "Report generated",
        message: "The admin performance report was generated.",
        type: "SYSTEM",
        actionUrl: "/admin/analytics",
        preview: "Admin report ready",
      },
      { dedupeMinutes: 30 }
    );

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to generate report.",
    });
  }
};

module.exports = {
  getAdminReport,
};

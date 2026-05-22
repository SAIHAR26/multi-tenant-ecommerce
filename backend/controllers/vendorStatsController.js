const Order = require("../models/Order");
const Product = require("../models/Product");
const Review = require("../models/Review");

const formatCurrency = (value = 0) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const getVendorStats = async (req, res) => {
  try {
    const vendorFilter = req.user?.role === "vendor" ? { vendor: req.user._id } : {};
    const products = await Product.find(vendorFilter).select("_id rating").lean();
    const productIds = products.map((product) => product._id);

    const orderFilter = productIds.length
      ? { "products.productId": { $in: productIds } }
      : {};
    const reviewFilter = productIds.length
      ? { productId: { $in: productIds } }
      : {};

    const [totalOrders, revenueResult, reviewResult] = await Promise.all([
      Order.countDocuments(orderFilter),
      Order.aggregate([
        ...(productIds.length
          ? [
              { $unwind: "$products" },
              { $match: { "products.productId": { $in: productIds } } },
            ]
          : []),
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
      ]),
      Review.aggregate([
        { $match: reviewFilter },
        { $group: { _id: null, averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const averageRating = Number((reviewResult[0]?.averageRating || 0).toFixed(1));

    res.status(200).json({
      stats: [
        { label: "Total Products", value: products.length, trend: "Live catalog", icon: "PR" },
        { label: "Total Revenue", value: formatCurrency(totalRevenue), trend: "MongoDB orders", icon: "RV" },
        { label: "Total Orders", value: totalOrders, trend: "Live orders", icon: "OR" },
        { label: "Average Reviews", value: averageRating, trend: `${reviewResult[0]?.totalReviews || 0} reviews`, icon: "RW" },
        { label: "Growth", value: totalOrders > 0 ? "+12%" : "0%", trend: "Prepared metric", icon: "GR" },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to load vendor statistics." });
  }
};

module.exports = {
  getVendorStats,
};

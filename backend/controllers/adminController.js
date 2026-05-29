const Order = require("../models/Order");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Store = require("../models/Store");
const User = require("../models/User");

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const formatProfile = async (admin) => {
  const [totalVendorsManaged, totalCustomers, totalProducts, totalOrders] = await Promise.all([
    User.countDocuments({ role: "vendor" }),
    User.countDocuments({ role: "customer" }),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);

  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    phone: admin.phone || "",
    location: admin.location || "",
    avatar: admin.avatar || "",
    role: admin.role,
    createdAt: admin.createdAt,
    lastLogin: admin.lastLogin || null,
    system: {
      totalVendorsManaged,
      totalCustomers,
      totalProducts,
      totalOrders,
    },
  };
};

const getAdminProfile = async (req, res) => {
  try {
    res.status(200).json(await formatProfile(req.user));
  } catch (error) {
    res.status(500).json({ message: error.message || "Admin profile could not be loaded." });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const updates = {};
    ["name", "phone", "location", "avatar"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.name !== undefined && !String(updates.name).trim()) {
      return res.status(400).json({ message: "Full name is required." });
    }

    const admin = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json(await formatProfile(admin));
  } catch (error) {
    res.status(400).json({ message: error.message || "Admin profile could not be updated." });
  }
};

const searchAdmin = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (query.length < 2) {
      return res.status(200).json({ query, results: [] });
    }

    const regex = new RegExp(escapeRegex(query), "i");
    const objectIdQuery = query.match(/^[a-f\d]{24}$/i) ? query : null;

    const [vendors, customers, products, orders, reviews, stores] = await Promise.all([
      User.find({ role: "vendor", $or: [{ name: regex }, { email: regex }, { "store.name": regex }] })
        .select("name email store approvalStatus")
        .limit(6)
        .lean(),
      User.find({ role: "customer", $or: [{ name: regex }, { email: regex }] })
        .select("name email")
        .limit(6)
        .lean(),
      Product.find({ $or: [{ name: regex }, { sku: regex }, { category: regex }] })
        .select("name category price stock")
        .limit(6)
        .lean(),
      Order.find({ ...(objectIdQuery ? { _id: objectIdQuery } : {}) })
        .populate("userId", "name email")
        .select("userId totalAmount status paymentStatus createdAt")
        .limit(6)
        .lean(),
      Review.find({ comment: regex })
        .populate("userId", "name email")
        .populate("productId", "name")
        .select("rating comment")
        .limit(6)
        .lean(),
      Store.find({ storeName: regex }).select("storeName vendorId storeCategory").limit(6).lean(),
    ]);

    const results = [
      ...vendors.map((vendor) => ({
        id: vendor._id,
        type: "vendor",
        title: vendor.store?.name || vendor.name,
        subtitle: vendor.email,
        url: "/admin/vendor-approvals",
      })),
      ...customers.map((customer) => ({
        id: customer._id,
        type: "customer",
        title: customer.name,
        subtitle: customer.email,
        url: "/admin/customers",
      })),
      ...products.map((product) => ({
        id: product._id,
        type: "product",
        title: product.name,
        subtitle: `${product.category || "Product"} - Stock ${product.stock || 0}`,
        url: `/admin/products?search=${encodeURIComponent(product.name)}`,
      })),
      ...orders.map((order) => ({
        id: order._id,
        type: "order",
        title: `Order ${order._id}`,
        subtitle: `${order.userId?.name || "Customer"} - ${order.status}`,
        url: "/admin/orders",
      })),
      ...reviews.map((review) => ({
        id: review._id,
        type: "review",
        title: `${review.rating} star review`,
        subtitle: review.productId?.name || review.comment,
        url: "/admin/reviews",
      })),
      ...stores.map((store) => ({
        id: store._id,
        type: "vendor",
        title: store.storeName,
        subtitle: store.storeCategory || "Store",
        url: "/admin/vendor-approvals",
      })),
    ];

    res.status(200).json({ query, results });
  } catch (error) {
    res.status(500).json({ message: error.message || "Search could not be completed." });
  }
};

module.exports = {
  getAdminProfile,
  searchAdmin,
  updateAdminProfile,
};

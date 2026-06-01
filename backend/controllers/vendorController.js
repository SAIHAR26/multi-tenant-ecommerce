const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Store = require("../models/Store");
const Notification = require("../models/Notification");

const getVendorId = (req) => req.user?._id;

const normalizeProductPayload = (body = {}, overrides = {}) => ({
  ...body,
  ...overrides,
  price: Number(body.price || 0),
  discount: Number(body.discount || 0),
  stock: Number(body.stock || 0),
  images: Array.isArray(body.images)
    ? body.images.filter(Boolean)
    : String(body.images || "")
        .split(",")
        .map((image) => image.trim())
        .filter(Boolean),
  sizes: Array.isArray(body.sizes)
    ? body.sizes.filter(Boolean)
    : String(body.sizes || "")
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean),
  colors: Array.isArray(body.colors)
    ? body.colors.filter(Boolean)
    : String(body.colors || "")
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean),
  tags: Array.isArray(body.tags)
    ? body.tags.filter(Boolean)
    : String(body.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
  isActive: body.status ? body.status === "Live" : body.isActive !== false,
});

const ensureVendorStore = async (vendorId, defaults = {}) => {
  let store = await Store.findOne({ vendorId }).sort({ createdAt: -1 });

  if (!store) {
    store = await Store.create({
      vendorId,
      storeName: defaults.storeName || "Vendor Store",
      storeDescription: defaults.storeDescription || "Live V SHOP seller storefront",
      storeCategory: defaults.storeCategory || defaults.category || "Marketplace",
      location: defaults.location || "",
    });
  }

  return store;
};

const getVendorProductIds = async (vendorId) => {
  const products = await Product.find({ vendor: vendorId }).select("_id");
  return products.map((product) => product._id);
};

const getVendorOrdersQuery = (productIds) => ({
  "products.productId": { $in: productIds },
});

const populateVendorOrderQuery = (query) =>
  query
    .populate("userId", "name email location")
    .populate({
      path: "products.productId",
      populate: [
        { path: "vendor", select: "name email" },
        { path: "storeId", select: "storeName location storeCategory" },
      ],
    });

const getVendorOrderAmount = (order, vendorProductIds) => {
  const vendorIds = new Set(vendorProductIds.map((id) => id.toString()));

  return order.products.reduce((sum, item) => {
    const product = item.productId;
    const productId = product?._id || product;

    if (!productId || !vendorIds.has(productId.toString())) {
      return sum;
    }

    return sum + Number(product.price || 0) * Number(item.quantity || 1);
  }, 0);
};

const formatStats = ({ products, orders, reviews, revenue }) => {
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
    : 0;

  const pendingOrders = orders.filter((order) =>
    ["PROCESSING", "PACKED"].includes(order.status)
  ).length;

  const lowStockProducts = products.filter(
    (product) => Number(product.stock || 0) <= Number(product.lowStockThreshold || 5)
  ).length;

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: revenue,
    totalReviews: reviews.length,
    averageRating,
    lowStockProducts,
    pendingOrders,
  };
};

const getVendorDashboardData = async (vendorId) => {
  const products = await Product.find({ vendor: vendorId }).sort({ createdAt: -1 });
  const productIds = products.map((product) => product._id);
  const orders = productIds.length
    ? await populateVendorOrderQuery(Order.find(getVendorOrdersQuery(productIds))).sort({ createdAt: -1 })
    : [];
  const reviews = productIds.length
    ? await Review.find({ productId: { $in: productIds } })
        .populate("userId", "name email")
        .populate("productId", "name vendor")
        .sort({ createdAt: -1 })
    : [];
  const revenue = orders.reduce(
    (sum, order) => sum + getVendorOrderAmount(order, productIds),
    0
  );

  return { products, orders, reviews, revenue };
};

exports.getDashboard = async (req, res) => {
  try {
    const vendorId = getVendorId(req);
    const store = await ensureVendorStore(vendorId, {
      storeName: req.user?.store?.name || req.user?.name || "Vendor Store",
    });
    const data = await getVendorDashboardData(vendorId);

    res.json({
      success: true,
      store,
      stats: formatStats(data),
      recentProducts: data.products.slice(0, 5),
      recentOrders: data.orders.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const data = await getVendorDashboardData(getVendorId(req));
    res.json({ success: true, stats: formatStats(data) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: getVendorId(req) })
      .populate("storeId")
      .sort({ createdAt: -1 });
    const productIds = products.map((product) => product._id);
    const orderCounts = productIds.length
      ? await Order.aggregate([
          { $unwind: "$products" },
          { $match: { "products.productId": { $in: productIds } } },
          { $group: { _id: "$products.productId", ordersCount: { $sum: "$products.quantity" } } },
        ])
      : [];
    const countsByProduct = new Map(
      orderCounts.map((item) => [item._id.toString(), item.ordersCount])
    );

    res.json({
      success: true,
      products: products.map((product) => ({
        ...product.toObject(),
        ordersCount: countsByProduct.get(product._id.toString()) || 0,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const vendorId = getVendorId(req);
    const store = await ensureVendorStore(vendorId, req.body);
    const payload = normalizeProductPayload(req.body, {
      vendor: vendorId,
      storeId: store._id,
    });

    const product = await Product.create(payload);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const vendorId = getVendorId(req);
    const product = await Product.findOne({ _id: req.params.id, vendor: vendorId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found for this vendor.",
      });
    }

    const store = await ensureVendorStore(vendorId, req.body);
    const payload = normalizeProductPayload(req.body, {
      vendor: vendorId,
      storeId: store._id,
    });

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: vendorId },
      payload,
      { new: true, runValidators: true }
    ).populate("storeId");

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      vendor: getVendorId(req),
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found for this vendor.",
      });
    }

    res.json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const productIds = await getVendorProductIds(getVendorId(req));
    const orders = productIds.length
      ? await populateVendorOrderQuery(Order.find(getVendorOrdersQuery(productIds))).sort({ createdAt: -1 })
      : [];

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const productIds = await getVendorProductIds(getVendorId(req));
    const reviews = productIds.length
      ? await Review.find({ productId: { $in: productIds } })
          .populate("userId", "name email")
          .populate("productId", "name")
          .sort({ createdAt: -1 })
      : [];

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRevenue = async (req, res) => {
  try {
    const data = await getVendorDashboardData(getVendorId(req));
    const monthly = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));

      const total = data.orders
        .filter((order) => {
          const createdAt = new Date(order.createdAt);
          return (
            createdAt.getFullYear() === date.getFullYear() &&
            createdAt.getMonth() === date.getMonth()
          );
        })
        .reduce((sum, order) => sum + getVendorOrderAmount(order, data.products.map((p) => p._id)), 0);

      return {
        label: date.toLocaleString("en", { month: "short" }),
        total,
      };
    });

    res.json({
      success: true,
      revenue: {
        grossSales: data.revenue,
        payoutReady: Math.round(data.revenue * 0.9),
        averageOrder: data.orders.length ? data.revenue / data.orders.length : 0,
        growthPercentage: 0,
        monthly,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const data = await getVendorDashboardData(getVendorId(req));
    const stats = formatStats(data);
    const topProducts = [...data.products]
      .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
      .slice(0, 5);

    res.json({
      success: true,
      analytics: {
        ...stats,
        topProducts,
        monthlyRevenue: (await exports.getRevenueData(getVendorId(req))).monthly,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRevenueData = async (vendorId) => {
  const data = await getVendorDashboardData(vendorId);
  const productIds = data.products.map((product) => product._id);
  const monthly = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));

    return {
      label: date.toLocaleString("en", { month: "short" }),
      total: data.orders
        .filter((order) => {
          const createdAt = new Date(order.createdAt);
          return (
            createdAt.getFullYear() === date.getFullYear() &&
            createdAt.getMonth() === date.getMonth()
          );
        })
        .reduce((sum, order) => sum + getVendorOrderAmount(order, productIds), 0),
    };
  });

  return { monthly };
};

exports.getStore = async (req, res) => {
  try {
    const store = await ensureVendorStore(getVendorId(req), {
      storeName: req.user?.store?.name || req.user?.name || "Vendor Store",
    });

    res.json({ success: true, store, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const store = await ensureVendorStore(getVendorId(req));
    const updatedStore = await Store.findOneAndUpdate(
      { _id: store._id, vendorId: getVendorId(req) },
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, store: updatedStore });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const query = {
      $and: [
        { $or: [{ userId: getVendorId(req) }, { userId: null }] },
        { $or: [{ role: "vendor" }, { targetRole: "vendor" }, { role: "all", targetRole: "all" }] },
      ],
    };
    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);
    const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

    res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        $and: [
          { $or: [{ userId: getVendorId(req) }, { userId: null }] },
          { $or: [{ role: "vendor" }, { targetRole: "vendor" }, { role: "all", targetRole: "all" }] },
        ],
      },
      { isRead: true, read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    res.json({ success: true, notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

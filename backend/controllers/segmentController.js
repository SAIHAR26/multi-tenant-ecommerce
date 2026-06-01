const Segment = require("../models/Segment");
const User = require("../models/User");
const Order = require("../models/Order");
const Review = require("../models/Review");
const { notifyAdmins } = require("../services/notificationService");

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalize = (value) => String(value ?? "").trim().toLowerCase();

const getDaysAgo = (date) => {
  if (!date) return Number.POSITIVE_INFINITY;
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
};

const getCustomerProfiles = async () => {
  const users = await User.find({ role: "customer" }).select("-password").lean();
  const [orders, reviews] = await Promise.all([
    Order.find()
    .populate("products.productId", "category")
      .lean(),
    Review.aggregate([{ $group: { _id: "$userId", reviews: { $sum: 1 } } }]),
  ]);

  const orderMap = new Map();
  const reviewMap = new Map(reviews.map((item) => [String(item._id), item.reviews]));

  orders.forEach((order) => {
    const userId = String(order.userId);
    const current = orderMap.get(userId) || {
      orderCount: 0,
      spentAmount: 0,
      completedOrders: 0,
      categories: new Set(),
      firstOrderDate: null,
      lastPurchaseDate: null,
    };

    current.orderCount += 1;
    if (order.status === "DELIVERED") {
      current.completedOrders += 1;
      current.spentAmount += toNumber(order.totalAmount);
    }

    if (!current.firstOrderDate || new Date(order.createdAt) < new Date(current.firstOrderDate)) {
      current.firstOrderDate = order.createdAt;
    }

    if (!current.lastPurchaseDate || new Date(order.createdAt) > new Date(current.lastPurchaseDate)) {
      current.lastPurchaseDate = order.createdAt;
    }

    order.products.forEach((item) => {
      if (item.productId?.category) {
        current.categories.add(item.productId.category);
      }
    });

    orderMap.set(userId, current);
  });

  return users.map((user) => {
    const orderStats = orderMap.get(String(user._id)) || {
      orderCount: 0,
      spentAmount: 0,
      completedOrders: 0,
      categories: new Set(),
      firstOrderDate: null,
      lastPurchaseDate: null,
    };

    const monthsActive = Math.max(
      1,
      Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / 2592000000)
    );

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      location: user.location || "",
      age: user.age || 0,
      joinedAt: user.createdAt,
      lastLogin: user.lastLogin,
      totalOrders: orderStats.orderCount,
      completedOrders: orderStats.completedOrders,
      spentAmount: orderStats.spentAmount,
      ordersPerMonth: Number((orderStats.orderCount / monthsActive).toFixed(1)),
      categories: Array.from(orderStats.categories),
      lastPurchaseDate: orderStats.lastPurchaseDate,
      lastPurchaseDays: getDaysAgo(orderStats.lastPurchaseDate),
      reviewCount: reviewMap.get(String(user._id)) || 0,
      status: user.isActive ? "Live" : "Inactive",
    };
  });
};

const evaluateCondition = (customer, condition) => {
  const field = condition.field;
  const operator = condition.operator;
  const expected = condition.value;

  if (field === "totalOrders") {
    return operator === ">" ? customer.totalOrders > toNumber(expected) : customer.totalOrders < toNumber(expected);
  }

  if (field === "completedOrders") {
    return operator === ">" ? customer.completedOrders > toNumber(expected) : customer.completedOrders < toNumber(expected);
  }

  if (field === "spentAmount") {
    return operator === ">" ? customer.spentAmount > toNumber(expected) : customer.spentAmount < toNumber(expected);
  }

  if (field === "lastLoginDays") {
    const days = getDaysAgo(customer.lastLogin);
    return operator === ">" ? days > toNumber(expected) : days < toNumber(expected);
  }

  if (field === "lastPurchaseDays") {
    return operator === ">" ? customer.lastPurchaseDays > toNumber(expected) : customer.lastPurchaseDays < toNumber(expected);
  }

  if (field === "lastPurchaseDate") {
    if (!customer.lastPurchaseDate) return false;
    return operator === "after"
      ? new Date(customer.lastPurchaseDate) > new Date(expected)
      : new Date(customer.lastPurchaseDate) < new Date(expected);
  }

  if (field === "ordersPerMonth") {
    return operator === ">" ? customer.ordersPerMonth > toNumber(expected) : customer.ordersPerMonth < toNumber(expected);
  }

  if (field === "joinedBefore") {
    return customer.joinedAt && new Date(customer.joinedAt) < new Date(expected);
  }

  if (field === "purchasedCategory") {
    return customer.categories.some((category) => normalize(category).includes(normalize(expected)));
  }

  if (field === "location") {
    return normalize(customer.location).includes(normalize(expected));
  }

  if (field === "age") {
    return operator === ">" ? customer.age > toNumber(expected) : customer.age < toNumber(expected);
  }

  if (field === "reviewCount") {
    return operator === ">" ? customer.reviewCount > toNumber(expected) : customer.reviewCount < toNumber(expected);
  }

  return true;
};

const systemSegments = [
  {
    name: "VIP Customers",
    description: "High lifetime value customers with frequent completed orders.",
    segmentType: "VIP Customers",
    conditions: [
      { field: "spentAmount", operator: ">", value: 100000 },
      { connector: "AND", field: "completedOrders", operator: ">", value: 4 },
    ],
  },
  {
    name: "Repeat Buyers",
    description: "Customers with multiple completed purchases.",
    segmentType: "Repeat Buyers",
    conditions: [{ field: "completedOrders", operator: ">", value: 1 }],
  },
  {
    name: "High Spenders",
    description: "Customers with the highest purchase value.",
    segmentType: "High Spenders",
    conditions: [{ field: "spentAmount", operator: ">", value: 50000 }],
  },
  {
    name: "Frequent Shoppers",
    description: "Customers with strong order frequency.",
    segmentType: "Frequent Shoppers",
    conditions: [{ field: "ordersPerMonth", operator: ">", value: 2 }],
  },
  {
    name: "Recent Buyers",
    description: "Customers who purchased in the last 30 days.",
    segmentType: "Recent Buyers",
    conditions: [{ field: "lastPurchaseDays", operator: "<", value: 30 }],
  },
  {
    name: "Inactive Users",
    description: "Customers without a purchase in the last 90 days.",
    segmentType: "Inactive Users",
    conditions: [{ field: "lastPurchaseDays", operator: ">", value: 90 }],
  },
];

const getMatchingCustomers = async (conditions = []) => {
  const customers = await getCustomerProfiles();

  if (!conditions.length) {
    return customers;
  }

  return customers.filter((customer) => {
    return conditions.reduce((result, condition, index) => {
      const passes = evaluateCondition(customer, condition);
      if (index === 0) return passes;
      return condition.connector === "OR" ? result || passes : result && passes;
    }, true);
  });
};

const formatPreviewCustomer = (customer) => ({
  id: customer.id,
  name: customer.name,
  orders: customer.totalOrders,
  completedOrders: customer.completedOrders,
  spent: `Rs ${currencyFormatter.format(customer.spentAmount)}`,
  lastPurchaseDate: customer.lastPurchaseDate,
  reviews: customer.reviewCount,
  status: customer.status,
});

const buildSegmentResponse = async (segment, totalCustomers) => {
  const matchingCustomers = await getMatchingCustomers(segment.conditions || []);
  return {
    ...(segment.toObject ? segment.toObject() : segment),
    customerCount: matchingCustomers.length,
    customerPercentage: totalCustomers
      ? Math.round((matchingCustomers.length / totalCustomers) * 1000) / 10
      : 0,
  };
};

const getSegments = async (req, res) => {
  try {
    const [savedSegments, totalCustomers] = await Promise.all([
      Segment.find().sort({ createdAt: -1 }),
      User.countDocuments({ role: "customer" }),
    ]);
    const dynamicSegments = await Promise.all(
      systemSegments.map((segment) => buildSegmentResponse({ ...segment, _id: `system-${segment.segmentType}` }, totalCustomers))
    );
    const customSegments = await Promise.all(savedSegments.map((segment) => buildSegmentResponse(segment, totalCustomers)));

    res.status(200).json([...dynamicSegments, ...customSegments]);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch segments." });
  }
};

const createSegment = async (req, res) => {
  try {
    const matchingCustomers = await getMatchingCustomers(req.body.conditions || []);
    const segment = await Segment.create({
      name: req.body.name,
      description: req.body.description,
      segmentType: req.body.segmentType,
      conditions: req.body.conditions || [],
      createdBy: req.user?._id || null,
      customerCount: matchingCustomers.length,
    });

    await notifyAdmins({
      title: "New customer segment created",
      message: `${segment.name} was created with ${matchingCustomers.length} matching customer${matchingCustomers.length === 1 ? "" : "s"}.`,
      type: "INFO",
      relatedEntity: segment._id,
      relatedEntityModel: "Segment",
      actionUrl: "/admin/segments",
      preview: "Customer segment created",
    });

    res.status(201).json({
      message: "Segment created successfully",
      segment,
      matchingUsers: matchingCustomers.map(formatPreviewCustomer),
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to create segment." });
  }
};

const getSegmentById = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const systemSegment = systemSegments.find((segment) => `system-${segment.segmentType}` === req.params.id);
    const segment = systemSegment || (await Segment.findById(req.params.id));

    if (!segment) {
      return res.status(404).json({ message: "Segment not found." });
    }

    const matchingCustomers = await getMatchingCustomers(segment.conditions);
    const customerPercentage = totalCustomers
      ? Math.round((matchingCustomers.length / totalCustomers) * 1000) / 10
      : 0;

    res.status(200).json({
      segment: {
        ...(segment.toObject ? segment.toObject() : segment),
        customerCount: matchingCustomers.length,
        customerPercentage,
      },
      matchingUsers: matchingCustomers.map(formatPreviewCustomer),
      customerPercentage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch segment." });
  }
};

const deleteSegment = async (req, res) => {
  try {
    const deletedSegment = await Segment.findByIdAndDelete(req.params.id);

    if (!deletedSegment) {
      return res.status(404).json({ message: "Segment not found." });
    }

    res.status(200).json({ message: "Segment deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete segment." });
  }
};

module.exports = {
  createSegment,
  deleteSegment,
  getSegmentById,
  getSegments,
};

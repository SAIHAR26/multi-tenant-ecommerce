const Segment = require("../models/Segment");
const User = require("../models/User");
const Order = require("../models/Order");

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
  const orders = await Order.find()
    .populate("products.productId", "category")
    .lean();

  const orderMap = new Map();

  orders.forEach((order) => {
    const userId = String(order.userId);
    const current = orderMap.get(userId) || {
      orderCount: 0,
      spentAmount: 0,
      categories: new Set(),
      firstOrderDate: null,
    };

    current.orderCount += 1;
    current.spentAmount += toNumber(order.totalAmount);

    if (!current.firstOrderDate || new Date(order.createdAt) < new Date(current.firstOrderDate)) {
      current.firstOrderDate = order.createdAt;
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
      categories: new Set(),
      firstOrderDate: null,
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
      spentAmount: orderStats.spentAmount,
      ordersPerMonth: Number((orderStats.orderCount / monthsActive).toFixed(1)),
      categories: Array.from(orderStats.categories),
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

  if (field === "spentAmount") {
    return operator === ">" ? customer.spentAmount > toNumber(expected) : customer.spentAmount < toNumber(expected);
  }

  if (field === "lastLoginDays") {
    const days = getDaysAgo(customer.lastLogin);
    return operator === ">" ? days > toNumber(expected) : days < toNumber(expected);
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

  return true;
};

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
  spent: `Rs ${currencyFormatter.format(customer.spentAmount)}`,
  status: customer.status,
});

const getSegments = async (req, res) => {
  try {
    const segments = await Segment.find().sort({ createdAt: -1 });
    res.status(200).json(segments);
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
    const segment = await Segment.findById(req.params.id);

    if (!segment) {
      return res.status(404).json({ message: "Segment not found." });
    }

    const matchingCustomers = await getMatchingCustomers(segment.conditions);

    res.status(200).json({
      segment,
      matchingUsers: matchingCustomers.map(formatPreviewCustomer),
      customerPercentage: Math.round((matchingCustomers.length / 64800) * 1000) / 10,
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

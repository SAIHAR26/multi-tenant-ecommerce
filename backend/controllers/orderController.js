const Notification = require("../models/Notification");
const Order = require("../models/Order");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch orders.",
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);

    await Notification.create({
      title: "New order received",
      message: `Order ${order._id} was created for Rs ${order.totalAmount}.`,
      type: "order",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to create order.",
    });
  }
};

module.exports = {
  getOrders,
  createOrder,
};

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
      userId: order.userId,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to create order.",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("products.productId", "name price");

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch order.",
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to update order.",
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json({
      message: "Order deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to delete order.",
    });
  }
};

module.exports = {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
};

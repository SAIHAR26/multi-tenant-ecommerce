const Notification = require("../models/Notification");
const Order = require("../models/Order");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "name price")
      .sort({ createdAt: -1 });

<<<<<<< HEAD
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });

=======
    res.status(200).json(orders);
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
  } catch (error) {
    res.status(500).json({
<<<<<<< HEAD
      success: false,
      message: error.message,
=======
      message: error.message || "Failed to fetch orders.",
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);

<<<<<<< HEAD
    const newOrder = new Order(req.body);

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      data: savedOrder,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
=======
    await Notification.create({
      title: "New order received",
      message: `Order ${order._id} was created for Rs ${order.totalAmount}.`,
      type: "order",
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
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
<<<<<<< HEAD

    const order = await Order.findById(req.params.id)
      .populate("userId", "name email");
=======
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("products.productId", "name price");
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8

    if (!order) {
      return res.status(404).json({
<<<<<<< HEAD
        success: false,
        message: "Order not found",
=======
        message: "Order not found.",
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
      });
    }

<<<<<<< HEAD
    res.status(200).json({
      success: true,
      data: order,
    });

=======
    res.status(200).json(order);
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
  } catch (error) {
    res.status(500).json({
<<<<<<< HEAD
      success: false,
      message: error.message,
    });

  }

};


// UPDATE ORDER

const updateOrder = async (req, res) => {

  try {

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
=======
      message: error.message || "Failed to fetch order.",
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({
<<<<<<< HEAD
        success: false,
        message: "Order not found",
=======
        message: "Order not found.",
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
      });
    }

    res.status(200).json({
<<<<<<< HEAD
      success: true,
      message: "Order deleted successfully",
=======
      message: "Order deleted successfully.",
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
    });
  } catch (error) {
    res.status(500).json({
<<<<<<< HEAD
      success: false,
      message: error.message,
=======
      message: error.message || "Failed to delete order.",
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
    });
  }
};

module.exports = {
  createOrder,
<<<<<<< HEAD
  getOrderById,
  updateOrder,
=======
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
  deleteOrder,
  getOrderById,
  getOrders,
};

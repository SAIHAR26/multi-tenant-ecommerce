const Order = require("../models/Order");


// GET ALL ORDERS

const getOrders = async (req, res) => {

  try {

    const orders = await Order.find()
      .populate("userId", "name email");

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// CREATE ORDER

const createOrder = async (req, res) => {

  try {

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
    });

  }

};


// GET ORDER BY ID

const getOrderById = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id)
      .populate("userId", "name email");

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }

    res.status(200).json({
      success: true,
      data: order,
    });

  } catch (error) {

    res.status(500).json({
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
    });

  }

};


// DELETE ORDER

const deleteOrder = async (req, res) => {

  try {

    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


module.exports = {
  getOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};
const Order = require("../models/Order");


// GET ALL ORDERS

const getOrders = async (req, res) => {

  try {

    const orders = await Order.find()
      .populate("userId", "name email");

    res.status(200).json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// CREATE ORDER

const createOrder = async (req, res) => {

  try {

    const newOrder = new Order(req.body);

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// GET ORDER BY ID

const getOrderById = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);

    if (!order) {

      return res.status(404).json({
        message: "Order not found",
      });

    }

    res.status(200).json(order);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


module.exports = {
  getOrders,
  createOrder,
  getOrderById,
};
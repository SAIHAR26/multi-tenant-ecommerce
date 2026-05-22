const Cart = require("../models/Cart");
const Product = require("../models/Product");

// GET CART
const getCart = async (req, res) => {

  try {

    const carts = await Cart.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price images");

    res.status(200).json({
      success: true,
      count: carts.length,
      data: carts,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ADD TO CART
const addToCart = async (req, res) => {

  try {

    const newCart = new Cart(req.body);

    const savedCart = await newCart.save();

    res.status(201).json({
      success: true,
      data: savedCart,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// UPDATE CART
const updateCart = async (req, res) => {

  try {

    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCart) {

      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });

    }

    res.status(200).json({
      success: true,
      data: updatedCart,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// DELETE CART
const deleteCart = async (req, res) => {

  try {

    const deletedCart = await Cart.findByIdAndDelete(req.params.id);

    if (!deletedCart) {

      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });

    }

    res.status(200).json({
      success: true,
      message: "Cart deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
  removeFromCart: deleteCart,
};

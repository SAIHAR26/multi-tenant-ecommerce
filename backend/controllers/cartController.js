const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");


// =====================
// GET CART
// =====================
const getCart = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("userId", "name email")
      .populate("items.productId"); // 🔥 populate products

    res.status(200).json({
      success: true,
      count: carts.length,
      data: carts,
    });

  } catch (error) {
    console.error("GET CART ERROR:", error); // 🔥 debug

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// ADD TO CART
// =====================
const addToCart = async (req, res) => {
  try {
    const { userId, items } = req.body;

    // 🔍 Check existing cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // 👉 Create new cart
      cart = new Cart({ userId, items });
    } else {
      // 👉 Update existing cart
      items.forEach((newItem) => {
        const existingItem = cart.items.find(
          (item) => item.productId.toString() === newItem.productId
        );

        if (existingItem) {
          // 🔥 increase quantity
          existingItem.quantity += newItem.quantity;
        } else {
          // 🔥 add new item
          cart.items.push(newItem);
        }
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cart,
    });

  } catch (error) {
    console.error("ADD CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// UPDATE CART
// =====================
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
    console.error("UPDATE CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// DELETE CART
// =====================
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
    console.error("DELETE CART ERROR:", error);

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

const Cart = require("../models/Cart");

// GET CART
const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({}).catch((err) => {
      console.log(err);
    });

    res.status(200).json(cart);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error getting cart",
    });
  }
};

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    res.status(200).json({
      message: "Add to cart working",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error adding cart",
    });
  }
};

// UPDATE CART
const updateCart = async (req, res) => {
  try {
    res.status(200).json({
      message: "Update cart working",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error updating cart",
    });
  }
};

// DELETE CART
const deleteCart = async (req, res) => {
  try {
    res.status(200).json({
      message: "Delete cart working",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error deleting cart",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
};
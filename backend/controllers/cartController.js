const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getUserId = (req) => req.user?._id;

const sendCartItems = async (res, userId) => {
  const cart = await Cart.findOne({ userId })
    .populate({
      path: "items.productId",
      select: "name price images brand category vendor storeId stock discount",
      populate: [
        { path: "vendor", select: "name email" },
        { path: "storeId", select: "storeName" },
      ],
    })
    .lean();

  const items =
    cart?.items.map((item) => ({
      _id: item.productId?._id,
      productId: item.productId?._id,
      product: item.productId,
      quantity: item.quantity,
      cartId: cart._id,
    })) || [];

  res.status(200).json({
    success: true,
    items,
  });
};

// GET CART
const getCart = async (req, res) => {

  try {

    await sendCartItems(res, getUserId(req));

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

    const userId = getUserId(req);
    const productId =
      req.body.productId ||
      req.body.product?._id ||
      req.body.product?.id;
    const quantity = Math.max(1, Number(req.body.quantity) || 1);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product id is required.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      await Cart.create({
        userId,
        items: [{ productId, quantity }],
      });
      return sendCartItems(res, userId);
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    await sendCartItems(res, userId);

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

    const userId = getUserId(req);
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId: req.params.id } } },
      { new: true }
    );

    if (!updatedCart) {

      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });

    }

    await sendCartItems(res, userId);

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

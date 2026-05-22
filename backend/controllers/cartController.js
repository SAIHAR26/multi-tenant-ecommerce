const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getUserId = (req) => req.user?._id;

const sendCartItems = async (res, userId) => {
  const cart = await Cart.findOne({ userId }).populate("items.productId");

  const items =
    cart?.items.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
      productId: item.productId?._id,
      product: item.productId,
    })) || [];

  res.status(200).json({ items });
};

const getCart = async (req, res) => {
  try {
    await sendCartItems(res, getUserId(req));
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to load cart." });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const productId = req.body.productId || req.body.product?._id || req.body.product?.id;
    const quantity = Math.max(Number(req.body.quantity) || 1, 1);

    if (!productId) {
      return res.status(400).json({ message: "Product id is required." });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId } },
      { new: true, upsert: true }
    );

    const existingItem = cart.items.find((item) => item.productId.toString() === productId.toString());

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    await sendCartItems(res, userId);
  } catch (error) {
    res.status(400).json({ message: error.message || "Unable to add item to cart." });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== id && item.productId.toString() !== id
    );

    await cart.save();
    await sendCartItems(res, userId);
  } catch (error) {
    res.status(400).json({ message: error.message || "Unable to remove item from cart." });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};

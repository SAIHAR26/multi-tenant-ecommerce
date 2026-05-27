const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Order = require("../models/Order");
require("../models/Product");

const getProductDiscount = (product, quantity) => {
  const subtotal = Number(product.price || 0) * quantity;
  const discountPercent = Math.min(Math.max(Number(product.discount || 0), 0), 100);
  return Math.round((subtotal * discountPercent) / 100);
};

const run = async () => {
  await connectDB();

  const orders = await Order.find().populate("products.productId");

  for (const order of orders) {
    let subtotal = 0;
    let discountAmount = 0;

    for (const item of order.products) {
      const product = item.productId;
      const quantity = Number(item.quantity) || 1;

      if (!product) continue;

      subtotal += Number(product.price || 0) * quantity;
      discountAmount += getProductDiscount(product, quantity);
    }

    const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
    const deliveryCharge = discountedSubtotal > 0 && discountedSubtotal < 999 ? 99 : 0;
    const totalAmount = discountedSubtotal + deliveryCharge;

    await Order.updateOne(
      { _id: order._id },
      {
        $set: {
          subtotal,
          discountAmount,
          deliveryCharge,
          totalAmount,
        },
      }
    );
  }

  const updatedOrders = await Order.find()
    .select("_id subtotal discountAmount deliveryCharge totalAmount")
    .sort({ createdAt: -1 })
    .lean();

  console.log(JSON.stringify(updatedOrders, null, 2));
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

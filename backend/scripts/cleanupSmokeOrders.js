const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Notification = require("../models/Notification");
const Order = require("../models/Order");
require("../models/Product");

const run = async () => {
  await connectDB();

  const orders = await Order.find({ deliveryAddress: "Smoke Test Address" })
    .sort({ createdAt: -1 })
    .lean();
  const ids = orders.map((order) => order._id);
  const messageFilters = ids.map((id) => ({ message: new RegExp(id.toString()) }));
  const notifications = messageFilters.length
    ? await Notification.find({ $or: messageFilters }).select("title userId targetRole message").lean()
    : [];

  console.log(
    JSON.stringify(
      {
        orders: orders.map((order) => ({
          id: order._id,
          subtotal: order.subtotal,
          discount: order.discountAmount,
          delivery: order.deliveryCharge,
          total: order.totalAmount,
        })),
        notifications,
      },
      null,
      2
    )
  );

  if (ids.length) {
    await Order.deleteMany({ _id: { $in: ids } });
    await Notification.deleteMany({ $or: messageFilters });
  }

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

const mongoose = require("mongoose");
require("dotenv").config();

const Order = require("../models/Order");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Store = require("../models/Store");
const User = require("../models/User");

const firstCount = (result) => result[0]?.count || 0;

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const [
    users,
    vendors,
    customers,
    stores,
    orders,
    products,
    reviews,
    orphanStores,
    orphanProducts,
    orphanOrders,
    orphanReviews,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "vendor" }),
    User.countDocuments({ role: "customer" }),
    Store.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments(),
    Review.countDocuments(),
    Store.aggregate([
      { $lookup: { from: "users", localField: "vendorId", foreignField: "_id", as: "vendor" } },
      { $match: { vendor: { $size: 0 } } },
      { $count: "count" },
    ]),
    Product.aggregate([
      { $lookup: { from: "stores", localField: "storeId", foreignField: "_id", as: "store" } },
      { $match: { store: { $size: 0 } } },
      { $count: "count" },
    ]),
    Order.aggregate([
      { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "customer" } },
      { $match: { customer: { $size: 0 } } },
      { $count: "count" },
    ]),
    Review.aggregate([
      { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "product" } },
      { $match: { product: { $size: 0 } } },
      { $count: "count" },
    ]),
  ]);

  console.log(
    JSON.stringify(
      {
        users,
        vendors,
        customers,
        stores,
        orders,
        products,
        reviews,
        orphanStores: firstCount(orphanStores),
        orphanProducts: firstCount(orphanProducts),
        orphanOrders: firstCount(orphanOrders),
        orphanReviews: firstCount(orphanReviews),
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});

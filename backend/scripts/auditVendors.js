const mongoose = require("mongoose");
require("dotenv").config();

const Store = require("../models/Store");
const User = require("../models/User");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME || "vshop" });

  const roleCounts = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const vendors = await User.find({ role: "vendor" })
    .select("name email role phone location store business approvalStatus isApproved createdAt")
    .sort({ createdAt: 1 })
    .lean();

  const stores = await Store.find()
    .select("vendorId storeName storeCategory location business createdAt")
    .sort({ createdAt: 1 })
    .lean();

  const storesByVendor = new Map(stores.map((store) => [String(store.vendorId), store]));

  console.log(
    JSON.stringify(
      {
        connectedDb: mongoose.connection.name,
        host: mongoose.connection.host,
        totalUsers: await User.countDocuments(),
        roleCounts,
        vendorCount: vendors.length,
        storeCount: stores.length,
        vendors: vendors.map((vendor) => ({
          id: vendor._id,
          name: vendor.name,
          email: vendor.email,
          phone: vendor.phone,
          location: vendor.location,
          approvalStatus: vendor.approvalStatus,
          store: storesByVendor.get(String(vendor._id)) || vendor.store,
          business: vendor.business,
        })),
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

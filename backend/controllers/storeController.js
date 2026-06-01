const Store = require("../models/Store");
const mongoose = require("mongoose");

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

const sendDatabaseUnavailable = (res) =>
  res.status(503).json({
    message: "Database is not connected. Check backend/.env MONGO_URI and restart the backend.",
  });

const createStore = async (req, res) => {
  try {
    const {
      vendorId,
      storeName,
      storeDescription,
      storeCategory,
      storeLogo,
      storeBanner,
      location,
    } = req.body;

    const targetVendorId = req.user?.role === "vendor" ? req.user._id : vendorId;

    if (!targetVendorId) {
      return res.status(400).json({ message: "Vendor id is required." });
    }

    const store = await Store.create({
      vendorId: targetVendorId,
      storeName,
      storeDescription,
      storeCategory,
      storeLogo,
      storeBanner,
      location,
    });

    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create store",
    });
  }
};

const getStores = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return sendDatabaseUnavailable(res);
    }

    const stores = await Store.find();

    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch stores",
    });
  }
};

const updateStore = async (req, res) => {
  try {
    const query =
      req.user?.role === "vendor"
        ? { _id: req.params.id, vendorId: req.user._id }
        : { _id: req.params.id };
    const updatedStore = await Store.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedStore) {
      return res.status(404).json({ message: "Store not found." });
    }

    res.status(200).json(updatedStore);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update store",
    });
  }
};

module.exports = {
  createStore,
  getStores,
  updateStore,
};

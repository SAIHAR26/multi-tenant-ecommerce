const Store = require("../models/Store");

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

    const store = await Store.create({
      vendorId,
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
    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

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
const Product = require("../models/Product");
require("../models/Store");
const Store = require("../models/Store");
const User = require("../models/User");

const normalizeProductPayload = async (body) => {
  const payload = {
    ...body,
    tags: Array.isArray(body.tags)
      ? body.tags
      : String(body.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
    isActive: body.status ? body.status === "Live" : body.isActive,
  };

  if (!payload.storeId || !payload.vendor) {
    const store = payload.storeId
      ? await Store.findById(payload.storeId)
      : await Store.findOne().sort({ createdAt: -1 });

    if (store) {
      payload.storeId = store._id;
      payload.vendor = payload.vendor || store.vendorId;
    }
  }

  if (!payload.vendor) {
    const vendor =
      (await User.findOne({ role: "vendor" }).sort({ createdAt: -1 })) ||
      (await User.findOne({ role: "admin" }).sort({ createdAt: -1 })) ||
      (await User.findOne().sort({ createdAt: -1 }));
    payload.vendor = vendor?._id;
  }

  if (!payload.storeId && payload.vendor) {
    const store = await Store.create({
      vendorId: payload.vendor,
      storeName: "V SHOP Marketplace",
      storeDescription: "Default admin marketplace store",
      storeCategory: payload.category || "Marketplace",
      location: "Global",
    });

    payload.storeId = store._id;
  }

  return payload;
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const { category, search, storeId } = req.query;

    const filters = {};

    if (category) {
      filters.category = category;
    }

    if (storeId) {
      filters.storeId = storeId;
    }

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filters)
      .populate("storeId")
      .sort({ createdAt: -1 });

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch products.",
    });
  }
};

// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch product.",
    });
  }
};

// CREATE PRODUCT
const addProduct = async (req, res) => {
  try {
    const payload = await normalizeProductPayload(req.body);
    const product = await Product.create(payload);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to add product.",
    });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const payload = await normalizeProductPayload(req.body);
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to update product.",
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully.",
    });

  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to delete product.",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};

const Product = require("../models/Product");
require("../models/Store");

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

const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);

  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to add product.",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
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
  addProduct,
  updateProduct,
  deleteProduct,
};

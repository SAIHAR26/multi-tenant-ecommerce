const mongoose = require("mongoose");
const Product = require("../models/Product");
require("../models/Store");

const Order = require("../models/Order");
const Store = require("../models/Store");
const User = require("../models/User");
const Wishlist = require("../models/Wishlist");
const { notifyAdmins, notifyCustomer, notifyVendor } = require("../services/notificationService");

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

const sendDatabaseUnavailable = (res) =>
  res.status(503).json({
    message: "Database is not connected. Check backend/.env MONGO_URI and restart the backend.",
  });

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

const ownsProduct = (product, user) =>
  user?.role === "admin" || product.vendor?.toString() === user?._id?.toString();

const applyVendorWriteScope = (payload, user) => {
  if (user?.role !== "vendor") {
    return payload;
  }

  return {
    ...payload,
    vendor: user._id,
  };
};

const getProductActionUrl = (role, product) => {
  if (role === "admin") return `/admin/products?search=${encodeURIComponent(product.name)}`;
  if (role === "vendor") return "/vendor/products";
  return `/customer/product/${product._id}`;
};

const notifyInterestedCustomers = async (product) => {
  const [wishlistMatches, orderMatches] = await Promise.all([
    Wishlist.find({ savedProducts: product._id }).select("userId").lean(),
    Order.find()
      .populate("products.productId", "category")
      .select("userId products")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean(),
  ]);

  const customerIds = new Set(wishlistMatches.map((item) => String(item.userId)));

  orderMatches.forEach((order) => {
    const matchesCategory = order.products.some((item) => item.productId?.category === product.category);
    if (matchesCategory) customerIds.add(String(order.userId));
  });

  return Promise.all(
    Array.from(customerIds)
      .slice(0, 25)
      .map((customerId) =>
        notifyCustomer(
          customerId,
          {
            title: `New ${product.category} product`,
            message: `${product.name} is now available in ${product.category}.`,
            type: "PRODUCT",
            relatedEntity: product._id,
            relatedEntityModel: "Product",
            actionUrl: getProductActionUrl("customer", product),
            preview: "New product available",
          },
          { dedupeMinutes: 60 }
        )
      )
  );
};

const notifyStockState = async (product) => {
  const stock = Number(product.stock || 0);
  const threshold = Number(product.lowStockThreshold || 0);

  if (stock > threshold) return;

  const title = stock <= 0 ? "Product out of stock" : "Low stock product detected";
  const message =
    stock <= 0
      ? `${product.name} is out of stock.`
      : `${product.name} has ${stock} item${stock === 1 ? "" : "s"} left.`;
  const type = stock <= 0 ? "WARNING" : "PRODUCT";

  await Promise.all([
    notifyVendor(
      product.vendor?._id || product.vendor,
      {
        title,
        message,
        type,
        relatedEntity: product._id,
        relatedEntityModel: "Product",
        actionUrl: getProductActionUrl("vendor", product),
        preview: stock <= 0 ? "Out of stock" : "Low stock",
      },
      { dedupeMinutes: 60 }
    ),
    notifyAdmins(
      {
        title,
        message,
        type,
        relatedEntity: product._id,
        relatedEntityModel: "Product",
        actionUrl: getProductActionUrl("admin", product),
        preview: stock <= 0 ? "Out of stock" : "Low stock",
      },
      { dedupeMinutes: 60 }
    ),
  ]);
};

const getCategoryImage = (category) => {
  const images = {
    Accessories:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    Footwear:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    Men:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    Shoes:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    Women:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
  };

  return (
    images[category] ||
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
  );
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return sendDatabaseUnavailable(res);
    }

    const { category, search, storeId, vendor } = req.query;

    const filters = {};

    if (category) {
      filters.category = category;
    }

    if (storeId) {
      filters.storeId = storeId;
    }

    if (vendor) {
      filters.vendor = vendor;
    }

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filters)
      .populate("vendor", "name email")
      .populate("storeId")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products.",
    });
  }
};

// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return sendDatabaseUnavailable(res);
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(req.params.id)
      .populate("vendor", "name email")
      .populate("storeId");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product.",
    });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("storeId")
      .sort({ rating: -1, discount: -1, createdAt: -1 })
      .limit(8);

    const categoryGroups = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
      { $sort: { count: -1, averageRating: -1 } },
      { $limit: 4 },
    ]);

    res.status(200).json({
      products,
      categories: categoryGroups.map((category) => ({
        title: category._id || "Recommended",
        reason: "Based on live marketplace signals",
        count: category.count,
        image: getCategoryImage(category._id),
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to load recommendations.",
    });
  }
};

// CREATE PRODUCT
const addProduct = async (req, res) => {
  try {
    const payload = applyVendorWriteScope(await normalizeProductPayload(req.body), req.user);

    if (req.user?.role === "vendor") {
      const store = await Store.findById(payload.storeId);

      if (!store || store.vendorId?.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "Vendors can only create products for their own store.",
        });
      }
    }
    const product = await Product.create(payload);
    const populatedProduct = await Product.findById(product._id).populate("vendor", "name email").populate("storeId");

    await Promise.all([
      notifyAdmins({
        title: "New product added",
        message: `${populatedProduct.vendor?.name || "A vendor"} added ${populatedProduct.name}.`,
        type: "PRODUCT",
        relatedEntity: populatedProduct._id,
        relatedEntityModel: "Product",
        actionUrl: getProductActionUrl("admin", populatedProduct),
        preview: "New product listed",
      }),
      notifyInterestedCustomers(populatedProduct),
      notifyStockState(populatedProduct),
    ]);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: populatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to add product.",
    });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    if (!ownsProduct(existingProduct, req.user)) {
      return res.status(403).json({
        message: "You can only update your own products.",
      });
    }

    const payload = applyVendorWriteScope(await normalizeProductPayload(req.body), req.user);

    if (req.user?.role === "vendor") {
      const store = await Store.findById(payload.storeId);

      if (!store || store.vendorId?.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "Vendors can only assign products to their own store.",
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    ).populate("vendor", "name email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await Promise.all([
      notifyAdmins({
        title: "Product updated",
        message: `${product.vendor?.name || "A vendor"} updated ${product.name}.`,
        type: "PRODUCT",
        relatedEntity: product._id,
        relatedEntityModel: "Product",
        actionUrl: getProductActionUrl("admin", product),
        preview: "Product details changed",
      }),
      notifyStockState(product),
    ]);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update product.",
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (!ownsProduct(existingProduct, req.user)) {
      return res.status(403).json({
        message: "You can only delete your own products.",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    await notifyAdmins({
      title: "Product deleted",
      message: `${existingProduct.name} was deleted.`,
      type: "PRODUCT",
      relatedEntity: existingProduct._id,
      relatedEntityModel: "Product",
      actionUrl: "/admin/products",
      preview: "Product removed",
    });

    res.status(200).json({
      success: true,
      productId: req.params.id,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete product.",
    });
  }
};

module.exports = {
  getProducts,
  getRecommendations,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};

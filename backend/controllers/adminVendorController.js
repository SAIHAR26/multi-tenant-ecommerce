const Notification = require("../models/Notification");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Store = require("../models/Store");
const User = require("../models/User");

const vendorSelect = "-password";

const getStatusQuery = (status) => {
  if (["pending", "approved", "rejected"].includes(status)) {
    return { approvalStatus: status };
  }

  return {};
};

const getVendorMetrics = async (vendorId) => {
  const products = await Product.find({ vendor: vendorId }).select("_id").lean();
  const productIds = products.map((product) => product._id);

  const [orders, reviews] = await Promise.all([
    productIds.length
      ? Order.find({ "products.productId": { $in: productIds } }).select("products totalAmount createdAt").lean()
      : [],
    productIds.length ? Review.countDocuments({ productId: { $in: productIds } }) : 0,
  ]);

  const revenue = orders.reduce((total, order) => total + Number(order.totalAmount || 0), 0);

  return {
    products: products.length,
    orders: orders.length,
    revenue,
    reviews,
  };
};

const formatVendor = async (vendor) => {
  const [store, metrics] = await Promise.all([
    Store.findOne({ vendorId: vendor._id }).lean(),
    getVendorMetrics(vendor._id),
  ]);

  return {
    id: vendor._id,
    name: vendor.name,
    email: vendor.email,
    phone: vendor.phone || "",
    location: vendor.location || store?.location || "",
    joinedDate: vendor.createdAt,
    isApproved: vendor.isApproved,
    approvalStatus: vendor.approvalStatus || "pending",
    rejectionReason: vendor.rejectionReason || "",
    store: {
      id: store?._id || vendor.store?.storeId || null,
      name: store?.storeName || vendor.store?.name || "",
      description: store?.storeDescription || "",
      category: store?.storeCategory || vendor.store?.category || "",
      location: store?.location || vendor.location || "",
      gst: "",
      businessId: "",
      documents: [],
      createdAt: store?.createdAt || null,
    },
    analytics: metrics,
    timeline: {
      accountCreated: vendor.createdAt,
      storeCreated: store?.createdAt || null,
      productsUploaded: metrics.products,
    },
  };
};

const getVendorApprovalRequests = async (req, res) => {
  try {
    const { status = "all", sort = "newest" } = req.query;
    const sortDirection = sort === "oldest" ? 1 : -1;
    const query = {
      role: "vendor",
      ...getStatusQuery(status),
    };

    const [vendors, pending, approved, rejected, total] = await Promise.all([
      User.find(query).select(vendorSelect).sort({ createdAt: sortDirection }).lean(),
      User.countDocuments({ role: "vendor", approvalStatus: "pending" }),
      User.countDocuments({ role: "vendor", approvalStatus: "approved" }),
      User.countDocuments({ role: "vendor", approvalStatus: "rejected" }),
      User.countDocuments({ role: "vendor" }),
    ]);

    const formattedVendors = await Promise.all(vendors.map(formatVendor));

    res.status(200).json({
      summary: {
        pending,
        approved,
        rejected,
        total,
      },
      vendors: formattedVendors,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch vendor approvals.",
    });
  }
};

const getVendorDetails = async (req, res) => {
  try {
    const vendor = await User.findOne({ _id: req.params.id, role: "vendor" }).select(vendorSelect).lean();

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    res.status(200).json(await formatVendor(vendor));
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch vendor profile.",
    });
  }
};

const approveVendor = async (req, res) => {
  try {
    const vendor = await User.findOneAndUpdate(
      { _id: req.params.id, role: "vendor" },
      {
        isApproved: true,
        approvalStatus: "approved",
        rejectionReason: "",
      },
      { new: true }
    )
      .select(vendorSelect)
      .lean();

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    await Notification.create({
      title: "Store approved",
      message: "Your store has been approved.",
      type: "vendor",
    });

    res.status(200).json(await formatVendor(vendor));
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to approve vendor.",
    });
  }
};

const rejectVendor = async (req, res) => {
  try {
    const { rejectionReason = "" } = req.body;

    if (!rejectionReason.trim()) {
      return res.status(400).json({ message: "Rejection reason is required." });
    }

    const vendor = await User.findOneAndUpdate(
      { _id: req.params.id, role: "vendor" },
      {
        isApproved: false,
        approvalStatus: "rejected",
        rejectionReason: rejectionReason.trim(),
      },
      { new: true }
    )
      .select(vendorSelect)
      .lean();

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    await Notification.create({
      title: "Application rejected",
      message: "Your application has been rejected.",
      type: "vendor",
    });

    res.status(200).json(await formatVendor(vendor));
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to reject vendor.",
    });
  }
};

module.exports = {
  approveVendor,
  getVendorApprovalRequests,
  getVendorDetails,
  rejectVendor,
};

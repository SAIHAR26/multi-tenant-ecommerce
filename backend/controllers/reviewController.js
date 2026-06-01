const Product = require("../models/Product");
const Review = require("../models/Review");
const { notifyAdmins, notifyVendor } = require("../services/notificationService");

const canManageReview = (review, user) =>
  user?.role === "admin" || review.userId?.toString() === user?._id?.toString();

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({
        path: "userId",
        select: "name email",
      })
      .populate({
        path: "productId",
        select: "name",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch reviews.",
    });
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    })
      .populate({
        path: "userId",
        select: "name email",
      })
      .populate({
        path: "productId",
        select: "name",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch product reviews.",
    });
  }
};

const createReview = async (req, res) => {
  try {
    const review = await Review.create({
      ...req.body,
      userId: req.user._id,
    });

    const product = await Product.findById(review.productId).select("name vendor").lean();

    await Promise.all([
      notifyAdmins({
        title: review.rating <= 2 ? "Low rating review alert" : "New review added",
        message: `A ${review.rating}-star review was added for ${product?.name || "a product"}.`,
        type: "REVIEW",
        relatedEntity: review._id,
        relatedEntityModel: "Review",
        actionUrl: "/admin/reviews",
        preview: "Product review received",
      }),
      notifyVendor(product?.vendor, {
        title: "Product review added",
        message: `${product?.name || "Your product"} received a ${review.rating}-star review.`,
        type: "REVIEW",
        relatedEntity: review._id,
        relatedEntityModel: "Review",
        actionUrl: "/vendor/reviews",
        preview: "New product review",
      }),
    ]);

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to add review.",
    });
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate({
        path: "userId",
        select: "name email",
      })
      .populate({
        path: "productId",
        select: "name",
      });

    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch review.",
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    if (!canManageReview(review, req.user)) {
      return res.status(403).json({ message: "Access denied." });
    }

    const allowedFields = ["rating", "comment", "images"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReview) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to update review.",
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    if (!canManageReview(review, req.user)) {
      return res.status(403).json({ message: "Access denied." });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Review deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to delete review.",
    });
  }
};

module.exports = {
  createReview,
  deleteReview,
  getReviewById,
  getReviewsByProduct,
  getReviews,
  updateReview,
};

const Notification = require("../models/Notification");
const Review = require("../models/Review");

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name email")
      .populate("productId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch reviews.",
    });
  }
};

const createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);

    await Notification.create({
      title: review.rating <= 2 ? "Low rating review alert" : "New product review",
      message: `A ${review.rating}-star review was added to a product.`,
      type: "review",
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to add review.",
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

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
  getReviews,
};

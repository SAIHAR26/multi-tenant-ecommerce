const Notification = require("../models/Notification");
const Review = require("../models/Review");

<<<<<<< HEAD

// GET ALL REVIEWS

=======
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name email")
      .populate("productId", "name")
      .sort({ createdAt: -1 });

<<<<<<< HEAD
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });

=======
    res.status(200).json(reviews);
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
  } catch (error) {
    res.status(500).json({
<<<<<<< HEAD
      success: false,
      message: error.message,
=======
      message: error.message || "Failed to fetch reviews.",
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
    });
  }
};

const createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);

<<<<<<< HEAD
    const newReview = new Review(req.body);

    const savedReview = await newReview.save();

    res.status(201).json({
      success: true,
      data: savedReview,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// GET SINGLE REVIEW

const getReviewById = async (req, res) => {

  try {

    const review = await Review.findById(req.params.id)
      .populate("userId", "name email")
      .populate("productId", "name");

    if (!review) {

      return res.status(404).json({
        success: false,
        message: "Review not found",
      });

    }

    res.status(200).json({
      success: true,
      data: review,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// UPDATE REVIEW

const updateReview = async (req, res) => {

  try {

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReview) {

      return res.status(404).json({
        success: false,
        message: "Review not found",
      });

    }

    res.status(200).json({
      success: true,
      data: updatedReview,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
=======
    await Notification.create({
      title: review.rating <= 2 ? "Low rating review alert" : "New product review",
      message: `A ${review.rating}-star review was added to a product.`,
      type: "review",
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
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
<<<<<<< HEAD
        success: false,
        message: "Review not found",
=======
        message: "Review not found.",
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
      });
    }

    res.status(200).json({
<<<<<<< HEAD
      success: true,
      message: "Review deleted successfully",
=======
      message: "Review deleted successfully.",
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
    });
  } catch (error) {
    res.status(500).json({
<<<<<<< HEAD
      success: false,
      message: error.message,
=======
      message: error.message || "Failed to delete review.",
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
    });
  }
};

module.exports = {
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
  getReviews,
};

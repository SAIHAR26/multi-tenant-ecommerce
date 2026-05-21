const Review = require("../models/Review");


// GET ALL REVIEWS

const getReviews = async (req, res) => {

  try {

    const reviews = await Review.find()
      .populate("userId", "name email")
      .populate("productId", "name");

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// CREATE REVIEW

const createReview = async (req, res) => {

  try {

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
    });

  }

};


// DELETE REVIEW

const deleteReview = async (req, res) => {

  try {

    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {

      return res.status(404).json({
        success: false,
        message: "Review not found",
      });

    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


module.exports = {
  getReviews,
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
};
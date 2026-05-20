const Review = require("../models/Review");


// GET REVIEWS

const getReviews = async (req, res) => {

  try {

    const reviews = await Review.find()
      .populate("userId", "name email")
      .populate("productId", "name");

    res.status(200).json(reviews);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// CREATE REVIEW

const createReview = async (req, res) => {

  try {

    const newReview = new Review(req.body);

    const savedReview = await newReview.save();

    res.status(201).json(savedReview);

  } catch (error) {

    res.status(500).json({
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
        message: "Review not found",
      });

    }

    res.status(200).json({
      message: "Review deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


module.exports = {
  getReviews,
  createReview,
  deleteReview,
};
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


module.exports = {
  getReviews,
  createReview,
};
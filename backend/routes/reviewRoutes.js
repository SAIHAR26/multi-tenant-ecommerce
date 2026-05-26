const express = require("express");

const router = express.Router();

const {
  getReviews,
  getReviewsByProduct,
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");


// GET ALL REVIEWS + CREATE REVIEW

router.route("/")
  .get(getReviews)
  .post(createReview);


// GET SINGLE REVIEW + UPDATE + DELETE

router.get("/product/:productId", getReviewsByProduct);

router.route("/:id")
  .get(getReviewById)
  .patch(updateReview)
  .delete(deleteReview);


module.exports = router;

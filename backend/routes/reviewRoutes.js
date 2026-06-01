const express = require("express");

const router = express.Router();
const { authorizeRoles, protect } = require("../middlewares/authMiddleware");

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
  .post(protect, authorizeRoles("customer"), createReview);


// GET SINGLE REVIEW + UPDATE + DELETE

router.get("/product/:productId", getReviewsByProduct);

router.route("/:id")
  .get(getReviewById)
  .patch(protect, updateReview)
  .delete(protect, deleteReview);


module.exports = router;

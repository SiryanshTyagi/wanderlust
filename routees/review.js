const express = require("express");

const router = express.Router({ mergeParams: true });
const {
  reviewValidation,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const Review = require("../models/review.js");

const ReviewController = require("../controllers/review.js");

// NEW REVIEW ROUTE - Place specific routes before the general SHOW route
router.post("/", isLoggedIn, reviewValidation, ReviewController.newReview);

//DELETE REVIEW
//Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  ReviewController.deleteReview
);

module.exports = router;

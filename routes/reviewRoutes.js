const express = require("express");
const authController = require("../controllers/newAuthController");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
router.post("/add-review", reviewController.addReview);
router.get(
  "/get-all-reviews",
  authController.protect,
  reviewController.getAllReviews
);
router.get(
  "/get-review/:id",
  authController.protect,
  authController.restrictTo("user"),
  reviewController.getReview
);

module.exports = router;

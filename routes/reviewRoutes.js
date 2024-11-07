const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
router.post("/add-review", reviewController.addReview);
router.get("/get-all-reviews", reviewController.getAllReviews);
router.get("/get-review/:id", reviewController.getReview);

module.exports = router;

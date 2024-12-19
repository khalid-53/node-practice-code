const reviewModel = require("../models/reviewsModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const factory = require("../controllers/handlerFactory");
//creating the new tour

exports.addReview = catchAsync(async (req, res, next) => {
  const review = await reviewModel.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await reviewModel.findById(req.params.id);
  if (!review) {
    return next(
      new appError(`there is no review against that ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await reviewModel.find();
  if (!reviews) {
    return next(new appError("no reviews found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
});

exports.deleteReview = factory.deleteOne(reviewModel);

const reviewModel = require("../models/reviewsModel");

//creating the new tour

exports.addReview = async (req, res, next) => {
  try {
    const review = await reviewModel.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    });
  } catch (error) {
    console.log("Error while creating the new tour", error);
  }
};

exports.getReview = async (req, res, next) => {
  try {
    const review = await reviewModel.findById(req.params.id);
    if (!review) {
      res.send(400).json({
        status: "failed",
        message: `there is no review against that ${req.params.id}`,
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    });
  } catch (err) {
    console.log("error while getting the tour", err);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await reviewModel.find();
    res.status(200).json({
      status: "success",
      data: {
        reviews,
      },
    });
  } catch (err) {
    console.log("Error", err);
  }
};

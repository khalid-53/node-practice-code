const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "review must required"],
    },
    rating: {
      type: Number,
      default: 4.5,
      required: [true, "rating field must required"],
      min: 1,
      max: 5,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "tour id must required"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "user id must required"],
    },
  },
  { timestamp: true }
);

// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "user",
//     select: "name",
//   }).populate({
//     path: "tour",
//     select: "name",
//   });
//   next();
// });
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

const reviewModel = mongoose.model("Review", reviewSchema);
module.exports = reviewModel;

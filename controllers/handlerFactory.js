const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new appError("No Document with the given id is found", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

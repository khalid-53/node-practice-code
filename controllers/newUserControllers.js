const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
exports.addNewUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({
      responseData: user,
      message: "user is created successfully",
    });
  } catch (err) {
    console.log("error while creating the user", err);
  }
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: users,
  });
});

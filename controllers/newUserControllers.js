const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
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

//this controller is used to update the current user
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new appError(
        "this route is not for password update please use the route /updatePassword to change the password",
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, "name", "email");
  const updatedUer = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ message: "success", updatedUer });
});

const User = require("../models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const signToken = (id) => {
  return jwt.sign({ id }, "secfklsaieioja423=-dd", {
    expiresIn: "90d",
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);
  res.status(200).json({
    message: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

// login controller

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError("incorrect Email or password!", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError("incorrect Email or password!", 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    message: "success",
    token,
    user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new appError("yor are not login please login to access", 401));
  }
  //verify the token
  const decoded = await promisify(jwt.verify)(token, "secfklsaieioja423=-dd");
  console.log("decoded value of the token is ", decoded);
  next();
});

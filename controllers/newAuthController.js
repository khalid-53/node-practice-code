const User = require("../models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
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
  const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError("the use belong to this token doesn't exist", 401)
    );
  }
  if (currentUser.changedAfterPassword(decoded.iat)) {
    return next(
      new appError(
        "user recently changed his password, please login again!",
        401
      )
    );
  }
  req.user = currentUser;
  //now here user can access the routes
  next();
});

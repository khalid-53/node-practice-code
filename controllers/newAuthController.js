const crypto = require("crypto");
const User = require("../models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const sendEmail = require("../utils/email");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: "90d",
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    message: "success",
    token,
    user,
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
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
      new appError("the user belong to this token doesn't exist", 401)
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

//this controller protect the routes and give the authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("you doesn't have permission to do this action", 403)
      );
    }
    next();
  };
};

//controller is used for forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new appError(
        `There is no user exit with that email ${req.body.email} address`,
        404
      )
    );
  }
  const resetToken = user.createPasswordRestToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password and submit a patch request with your new password and password confirm to: ${resetUrl} \n if you didn't forgot your password then just ignore this message`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token valid for just 10mins",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "token is send to the email",
    });
  } catch (err) {
    console.log("error is ", err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new appError(
        "there is an error while sending the email please try again later!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new appError("Token is invalid or has expired"));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get the user
  const user = await User.findById(req.user.id).select("+password");
  //check if the current user is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password)))
    return next(
      new appError(
        "your password is incorrect you have not permission to change the password",
        401
      )
    );
  //if it is valid user then change the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //now send the token
  createSendToken(user, 200, res);
});
// exports.restrictTo = catchAsync(async (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new appError("you doesn't have permission to do this action", 403)
//       );
//     }
//     next();
//   };
// });

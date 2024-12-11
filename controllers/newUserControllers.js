const multer = require("multer");
const fs = require("fs");
const path = require("path");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const uploadDir = path.resolve("public/images/user");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
  },
});

//function to filter the files allow only images to enter

const filterImages = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new appError("file is not image", 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: filterImages,
});
const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.uploadUserPhoto = upload.single("photo");

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

//this controller is used to inactive the user account when he wants to delete

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: "success" });
});

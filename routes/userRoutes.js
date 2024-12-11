const express = require("express");
const router = express.Router();
const authController = require("../controllers/newAuthController");
const userController = require("../controllers/newUserControllers");
router.post("/addUser", userController.addNewUser);
router.get("/get-all-users", userController.getAllUsers);
router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);
router.patch(
  "/updateMe",
  authController.protect,
  userController.uploadUserPhoto,
  userController.updateMe
);
router.delete("/deleteMe", authController.protect, userController.deleteMe);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);
module.exports = router;

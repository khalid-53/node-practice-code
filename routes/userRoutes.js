const express = require("express");
const authController = require("../controllers/newAuthController");
const userController = require("../controllers/newUserControllers");
const router = express.Router();
router.post("/addUser", userController.addNewUser);
router.get("/get-all-users", userController.getAllUsers);
router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);
router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);
module.exports = router;

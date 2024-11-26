const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:OTP", authController.resetPassword);

router.use(authController.protect);

// prettier-ignore
router.patch("/updateMe", userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);
router.get("/getMe", userController.getMe);
router.delete("/deleteMe", userController.deleteMe);

module.exports = router;

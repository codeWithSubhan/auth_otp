const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.get("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);

router.use(authController.protect);

router.patch("/updateUser", userController.updateUser);
// router.get("/getUser", authController.getUser);

module.exports = router;

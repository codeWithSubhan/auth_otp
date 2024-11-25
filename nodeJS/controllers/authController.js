const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");

const User = require("../models/userModel");
const AppError = require("../utiles/appError");
const catchAsync = require("../utiles/catchAsync");
const Email = require("../utiles/email");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  cookieOptions.secure = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Please provide email and password!", 400));

  const user = await User.findOne({ email });

  if (!user) return next(new AppError("User not found", 404));

  if (!(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect email or password!", 401));

  createSendToken(user, 201, res);
});

exports.logout = catchAsync(async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ status: "success" });
});

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  console.log(req.headers);
  // console.log(req.cookies.jwt);

  let token;

  if (authorization && authorization.startsWith("Bearer"))
    token = authorization.split(" ")[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;

  if (!token)
    return next(new AppError("Access Denied. No token provided!", 401));

  // 1) jwt isCorrect
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 2) user isExist
  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(new AppError("User is not belong to this JWT token!", 401));

  // 3) jwt's timeStamp must greater than passwordChangedAt's timeStamp
  if (await currentUser.changePasswordAfter(decoded.iat))
    return next(new AppError("Password recently changed, login again", 401));

  req.user = currentUser;

  console.log("req.user:", req.user);
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError("User not found!", 404));

  const OTP = user.generateOTP();
  await user.save({ validateBeforeSave: false });

  // send to user gmail to forgot password
  try {
    console.log("OTP:", OTP, "user:", user);
    await new Email(user, OTP).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "OTP sent to email!",
    });
  } catch (err) {
    user.encryptedOTP = undefined;
    user.expiredOTP = undefined;
    await user.save({ validateBeforeSave: false });

    console.log("email errorrrr🔥🔥:", err);
    const msg = "Ther was an error sending the email. Please try again later!";
    return next(new AppError(msg, 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  console.log(req.params.OTP);

  if (!req.body.password || !req.params.OTP)
    return next(new AppError("Invalid Fields!", 400));

  const hashedOTP = crypto
    .createHash("sha256")
    .update(req.params.OTP)
    .digest("hex");

  console.log("hashedOTP:", hashedOTP);

  const user = await User.findOne({
    encryptedOTP: hashedOTP,
    expiredOTP: { $gt: Date.now() },
  });

  console.log("user:", user);

  if (!user) return next(new AppError("OTP is invalid or has expired!", 400));

  user.password = req.body.password;
  user.encryptedOTP = undefined;
  user.expiredOTP = undefined;
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
});

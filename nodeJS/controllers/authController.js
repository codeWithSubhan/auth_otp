const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../models/userModel");
const AppError = require("../utiles/appError");
const catchAsync = require("../utiles/catchAsync");

const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

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

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization, cookie } = req.headers;

  let token;

  if (authorization && authorization.startsWith("Bearer"))
    token = authorization.split(" ")[1];
  else if (cookie && cookie.startsWith("jwt")) token = cookie.split("=")[1];

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
  createSendToken(user, 201, res);
});

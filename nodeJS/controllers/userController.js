const User = require("../models/userModel");
const catchAsync = require("../utiles/catchAsync");

const filterObj = (obj, ...allowFileds) => {
  const newObj = {};

  Object.keys(obj).forEach((item) => {
    if (allowFileds.includes(item)) newObj[item] = obj[item];
  });

  return newObj;
};

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) return next(new AppError(`No user found!`, 404));

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, "email", "name", "contact");

  console.log("filteredBody:", filteredBody);

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, // By default, returns the old document before the update.
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.id);

  if (!user) return next(new AppError(`No user found!`, 404));

  res.status(204).json({
    status: "success",
    data: null,
  });
});

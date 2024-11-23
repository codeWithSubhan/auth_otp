const User = require("../models/userModel");
const catchAsync = require("../utiles/catchAsync");

const filterObj = (obj, ...allowFileds) => {
  const newObj = {};

  Object.keys(obj).forEach((item) => {
    if (allowFileds.includes(item)) newObj[item] = obj[item];
  });

  return newObj;
};

exports.updateUser = catchAsync(async (req, res, next) => {
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

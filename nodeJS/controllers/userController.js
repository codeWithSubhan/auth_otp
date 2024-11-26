const multer = require("multer");
const sharp = require("sharp");

const User = require("../models/userModel");
const catchAsync = require("../utiles/catchAsync");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Invalid image", 400), false);
};

const upload = multer({ storage, fileFilter });
exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `${req.user.id}.jpeg`;

  console.log(req.file.filename);

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/${req.file.filename}`);

  next();
});

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
  const filteredBody = filterObj(req.body, "email", "name", "contact", "photo");
  // if (req.file) {
  //   filteredBody.photo = `${req.protocol}://${req.get("host")}/images/${
  //     req.file.filename
  //   }`;
  // }

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

const AppError = require("../utiles/appError");

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(err);
  console.error("FULL ERROR  🔥🔥", err);

  // if (err.code === 11000) err = handleDuplicateFields(err);
  // if (err.name === "ValidationError") err = handleValidationErrorDB(err);
  // if (err.name === "JsonWebTokenError") err = handleJWTError();
  // if (err.name === "CastError") err = handleCastErrorDB(err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const handleDuplicateFields = (err) => {
  const value = Object.keys(err.keyPattern)[0];
  const message = `The ${value} is already used!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  return new AppError(`Invalid input data. ${err.errors.name.path}`, 400);
};

const handleJWTError = () => new AppError("Invalid JWT token!", 401);
const handleCastErrorDB = (err) => {
  new AppError(`Invalid`, 400);
};
module.exports = globalError;

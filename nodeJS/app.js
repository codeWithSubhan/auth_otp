const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const ExpressMongoSanitize = require("express-mongo-sanitize");

const userRouter = require("./routes/userRoutes");
const AppError = require("./utiles/appError");
const globalError = require("./controllers/errorController");

const app = express();

// MIDDLEWARES
app.use(xss());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(ExpressMongoSanitize());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/users", userRouter);

app.all("*", (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} URL on this server!`, 404));
});

app.use(globalError);

module.exports = app;

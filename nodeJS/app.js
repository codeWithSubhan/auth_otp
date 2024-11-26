const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const ExpressMongoSanitize = require("express-mongo-sanitize");

const userRouter = require("./routes/userRoutes");
const AppError = require("./utiles/appError");
const globalError = require("./controllers/errorController");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARES
app.use(xss());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(ExpressMongoSanitize());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.all("*", (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} URL on this server!`, 404));
});

app.use(globalError);

module.exports = app;

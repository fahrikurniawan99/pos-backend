var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const { decodeToken } = require("./middlewares");
const productsRouter = require("./app/product/routes");
const categoryRouter = require("./app/category/routes");
const tagsRouter = require("./app/tag/routes");
const authRouter = require("./app/auth/routes");
const deliveryAddressRouter = require("./app/deliveryAddress/routes");
const orderRouter = require("./app/order/routes");
const cartRouter = require("./app/cart/routes");
const invoiceRouter = require("./app/invoice/routes");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(decodeToken());

app.use("/auth", authRouter);
app.use("/api", productsRouter);
app.use("/api", categoryRouter);
app.use("/api", tagsRouter);
app.use("/api", deliveryAddressRouter);
app.use("/api", orderRouter);
app.use("/api", cartRouter);
app.use("/api", invoiceRouter);
app.use("/", (req, res) => {
  res.render("index", {
    title: "Eduwork API server",
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

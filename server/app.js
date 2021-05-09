const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const { readdirSync } = require("fs");
require("dotenv").config();

let data;
var sensorData;

// Biến cho cảm biến chuyển động
var motion = 0;

// Trạng thái ban đầu của cảnh báo
var alarm = 0;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

//app
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERR", err));

//middlewares
app.use(bodyParser.json({ limit: "2mb" }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// route middlewares
readdirSync("./routes").map((r) => app.use(`/api/`, require("./routes/" + r)));

// route
app.get("/api", (req, res) => {
  res.json({
    data: "hey you hit node API",
  });
});

// app.post("/api/users", function (req, res) {
//   console.log("here");

//   data = req.body;
//   console.log(data);
//   res.send("Data received: " + data);
// });

//
app.post("/update-sensor", function (req, res) {
  data = req.body;
  sensorData = data;
  console.log("update sensor-->", data, typeof data);
  res.send("sensor received: " + data);
});
//
app.get("/update-sensor", function (req, res) {
  data = req.body;
  console.log("update sensor GET-->", data, typeof data);
  res.json(sensorData);
});

// port
const port = process.env.PORT || 8000;

app.listen(port, "0.0.0.0", () =>
  console.log(`Server is running on port ${port}`)
);

module.exports = app;

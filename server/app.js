var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const bodyParser = require("body-parser");
const { readdirSync } = require("fs");
require("dotenv").config();

let data;

// Biến cho cảm biến chuyển động
var motion = 0;

// Trạng thái ban đầu của cảnh báo
var alarm = 0;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const { log } = require("console");

//app
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//db

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
// route middlewares
// readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

app.post("/api/users", function (req, res) {
  console.log("here");

  data = req.body;
  console.log(data);
  res.send("Data received: " + data);
});

//
app.post("/update-sensor", function (req, res) {
  data = parseFloat(req.body.value1);
  console.log("update sensor-->", data, typeof data);
  res.send("sensor received: " + data);
});

// Thay đổi trạng thái cảm biến cd
app.post("/motion", function (req, res) {
  motion = req.query;
  console.log(motion);
  res.send("Data received: " + motion);
});

// Lấy trạng thái cảm biến cd
app.get("/motion", function (req, res) {
  res.json({ state: motion });
});

// port
const port = process.env.PORT || 8000;

app.listen(port, "192.168.2.224", () =>
  console.log(`Server is running on port ${port}`)
);

module.exports = app;

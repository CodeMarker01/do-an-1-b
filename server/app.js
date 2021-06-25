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

//set TimeZone
process.env.TZ = "Asia/Ho_Chi_Minh";

// todo test lib
const { convertTZ } = require("./utils");

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
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERR", err));

//middlewares
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

// route middlewares
readdirSync("./routes").map((r) => {
  console.log("routes name", `/api/${r.split(".")[0]}`);
  // return app.use(`/api/${r.split(".")[0]}`, require("./routes/" + r));
  return app.use(`/api/`, require("./routes/" + r));
});
//localhost/api/users

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

// todo test
//Asia/Ho_Chi_Minh
const date = new Date();
console.log("new Date", date);
// const dateLocal = convertTZ(date, "Asia/Ho_Chi_Minh");
// console.log("date after convert", dateLocal);
// const dateLocal2 = new Date(
//   date.toLocaleString("en-US", {
//     timeZone: "Asia/Ho_Chi_Minh",
//   })
// );
// console.log("date local", dateLocal2);
// const dateLocal3 = new Date("Sun Jun 20 2021 09:31:43 GMT+0700");
// console.log("🚀 ~ file: app.js ~ line 108 ~ dateLocal3", dateLocal3);
// const dateLocal4 = new Date()

// todo end test

// port
const port = process.env.PORT || 8000;

app.listen(port, "0.0.0.0", () =>
  console.log(`Server is running on port ${port}`)
);

module.exports = app;

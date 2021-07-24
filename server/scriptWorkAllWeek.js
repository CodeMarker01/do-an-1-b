const mongoose = require("mongoose");
const Activity = require("./models/activity");
const {
  getBeginningOfTheWeek,
  getEnddingOfTheWeek,
  getBeginningOfTheMonth,
  getEnddingOfTheMonth,
} = require("./utils");

function randomInRange(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

function randomCheckIn(date, number) {
  date.setDate(date.getDate() + number);
  date.setHours(randomInRange(7, 10), randomInRange(0, 58), 0, 0);
  return date;
}

function randomCheckOut(date, number) {
  date.setDate(date.getDate() + number);
  date.setHours(randomInRange(15, 20), randomInRange(0, 58), 0, 0);
  return date;
}

// add dump data to db
const addDb = async () => {
  for (let i = 0; i <= 23; i++) {
    const dumpWork = {
      // userId: "60cf4873b401ed7068dd5b88",
      userId: "60fb5a523179c12b8426647b",
      checkInTime: randomCheckIn(
        getBeginningOfTheWeek(new Date("2021-07-01")),
        i
      ),
      checkOutTime: randomCheckOut(
        getBeginningOfTheWeek(new Date("2021-07-01")),
        i
      ),
      username: "trinhmai",
      status: "approved",
      mode: "fingerprint",
    };
    // dumpWork.workingTime =
    // Math.abs(dumpWork.checkOutTime - dumpWork.checkInTime) / 3600000;
    const activity = new Activity(dumpWork);
    await activity.save();
  }
  mongoose.connection.close();
};

//db
mongoose
  .connect("mongodb://localhost:27017/manage-employ-spkt", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(addDb)
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERR", err));

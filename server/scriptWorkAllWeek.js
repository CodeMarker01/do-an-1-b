const mongoose = require("mongoose");
const Activity = require("./models/activity");
const { getBeginningOfTheWeek } = require("./utils");

function randomInRange(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

function randomCheckIn(date, number) {
  date.setDate(date.getDate() + number);
  date.setHours(randomInRange(7, 9), 0, 0, 0);
  return date;
}

function randomCheckOut(date, number) {
  date.setDate(date.getDate() + number);
  date.setHours(randomInRange(16, 18), 0, 0, 0);
  return date;
}

// add dump data to db
const addDb = async () => {
  for (let i = 0; i <= 7; i++) {
    const dumpWork = {
      // userId: "60cf4873b401ed7068dd5b88",
      userId: "60b3065a5d39696df8abccf6",
      checkInTime: randomCheckIn(getBeginningOfTheWeek(new Date()), i),
      checkOutTime: randomCheckOut(getBeginningOfTheWeek(new Date()), i),
    };
    dumpWork.workingTime =
      Math.abs(dumpWork.checkOutTime - dumpWork.checkInTime) / 3600000;
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

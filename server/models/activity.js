const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
    },
    //     rfid: {
    //       type: ObjectId,
    //       ref: "User",
    //     },
    //     userId: {
    //       type: ObjectId,
    //       ref: "User",
    //     },
    checkInTime: {
      // type: String,
      // default: "not-set",
      type: Date,
      default: Date.now,
    },
    checkOutTime: {
      type: Date,
      default: Date.now,
    },
    workingTime: String,
    salary: {
      type: Number,
      default: 1000000,
    },
    date: {
      type: Date,
      // default: new Date().getMinutes(),
      default: Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);

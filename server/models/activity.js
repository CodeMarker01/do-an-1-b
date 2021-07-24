const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
    },
    username: { type: String },
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
      // default: Date.now,
      default: null,
    },
    checkOutTime: {
      type: Date,
      // default: Date.now,
      default: null,
    },
    workingTime: String,
    // salary: {
    //   type: Number,
    //   default: 1000000,
    // },
    date: {
      type: Date,
      // default: new Date().getMinutes(),
      default: Date.now(),
    },
    status: {
      type: String,
      default: "normal",
    },
    mode: {
      type: String,
      default: "fingerprint",
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);

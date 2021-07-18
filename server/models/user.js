const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "subscriber",
    },
    avatar: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    rfid: {
      type: String,
      default: "not-set",
    },
    fingerprint: {
      type: String,
      default: "not-set",
    },
    // checkInTime: {
    //   type: String,
    //   default: "not-set",
    // },
    // CheckInDate: String,
    // checkOutTime: {
    //   type: String,
    //   default: "not-set",
    // },
    // CheckOutDate: String,
    // workingTime: String,
    salary: {
      type: Number,
      default: 1000000,
    },
    coeffSalary: {
      type: Number,
      default: 0,
    },
    testTime: {
      type: Date,
    },
    address: String,
    position: {
      type: String,
      default: "Software Engineer",
    },
    //   wishlist: [{ type: ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

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
    RFID: String,
    CheckInTime: String,
    CheckInDate: String,
    CheckOutTime: String,
    CheckOutDate: String,
    testTime: {
      type: Date,
    },
    address: String,
    //   wishlist: [{ type: ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

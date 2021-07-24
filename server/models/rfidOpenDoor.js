const mongoose = require("mongoose");

const rfidOpenDoorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "123456789123",
    },
    rfid: {
      type: String,
    },
    role: {
      type: String,
      default: "Guest",
    },
    enable: {
      type: Number,
      default: 1,
    },
    createTime: {
      type: Date,
      default: Date.now(),
    },
    createTimeLocalTime: {
      type: String,
      default: "not-set",
    },
    checkOutTimeOpenDoor: {
      type: Date,
      default: Date.now(),
    },
    expireTime: {
      type: Number,
      default: 60000,
    },
    status: {
      type: String,
      default: "decline",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RfidOpenDoor", rfidOpenDoorSchema);

const express = require("express");
const router = express.Router();
const moment = require("moment");

const { authCheck } = require("../middlewares/auth");
const User = require("../models/user");
const Activity = require("../models/activity");
const {
  isValidDate,
  getBeginningOfTheDay,
  getEndingOfTheDay,
} = require("../utils");

// @route    POST api/user/check-in-out
// @desc     Create or update user profile
// @access   Public (test)
//"checkInTime":"2018-12-30T05:59:00"

router.post("/user/check-in-out", async (req, res) => {
  const { checkInTime, checkOutTime, checkOutCode } = req.body;

  //build object checkIn checkOut
  const ObjCheckInOutUpdate = {};
  if (checkInTime && isValidDate(checkInTime)) {
    // const checkInTimeDate = new Date(checkInTime);
    ObjCheckInOutUpdate.checkInTime = new Date(checkInTime);
  }
  if (checkOutTime && isValidDate(checkOutTime)) {
    // const checkOutTimeDate = new Date(checkOutTime);
    ObjCheckInOutUpdate.checkOutTime = new Date(checkOutTime);
  }
  if (ObjCheckInOutUpdate.checkInTime && ObjCheckInOutUpdate.checkOutTime) {
    ObjCheckInOutUpdate.workingTime =
      Math.abs(
        ObjCheckInOutUpdate.checkInTime - ObjCheckInOutUpdate.checkOutTime
      ) / 3600000;
    //   const diffTime = Math.abs(checkOutTimeDate - checkInTimeDate) / 3600000;
  }
  // check checkOutCode is valid for ObjectId, if not create ObjectId format for exceptioin
  const ObjectId = require("mongoose").Types.ObjectId;
  let checkOutCodeIdValid = "123456789012";
  if (ObjectId.isValid(checkOutCode)) {
    checkOutCodeIdValid = ObjectId(
      checkOutCode.length < 12 ? "123456789012" : checkOutCode
    );
  }
  console.log("Object Id checkout-->", checkOutCodeIdValid);
  console.log("ObjCheckInOutUpdate", ObjCheckInOutUpdate);
  // You should make string 'param' as ObjectId type. To avoid exception,
  // the 'param' must consist of more than 12 characters.

  try {
    const findPreviousCheck = await User.findOne({
      $or: [
        { _id: checkOutCodeIdValid },
        { rfid: checkOutCode },
        { fingerprint: checkOutCode },
      ],
    }).exec();
    console.log(
      "🚀 ~ file: profile.js ~ line 82 ~ router.post ~ findPreviousCheck",
      findPreviousCheck
    );
    const { checkInTime, checkOutTime } = findPreviousCheck;
    if (!ObjCheckInOutUpdate.checkInTime) {
      ObjCheckInOutUpdate.checkInTime = new Date(checkInTime);
    }
    if (!ObjCheckInOutUpdate.checkOutTime) {
      ObjCheckInOutUpdate.checkOutTime = new Date(checkOutTime);
    }
    ObjCheckInOutUpdate.workingTime =
      Math.abs(
        ObjCheckInOutUpdate.checkInTime - ObjCheckInOutUpdate.checkOutTime
      ) / 3600000;

    let activity;

    // console.log(
    //   `ngay trong tuan se bat dau tu ${moment()
    //     .startOf("isoweek")
    //     .toDate()} cho den ${moment().endOf("isoweek").toDate()}`
    // );
    // const mondayMoment = moment().day(1); /* (3600000 * 24)*/
    // console.log(
    //   "checkIn - monday of week",
    //   ObjCheckInOutUpdate.checkOutTime.getDay(),
    //   moment(),
    //   mondayMoment,
    //   Math.abs(moment() - mondayMoment)
    // );

    // console.log(
    //   typeof activityData.date,
    //   activityData.date.getDate(),
    //   activityData.date
    // );
    // console.log("today", new Date().getDate(), new Date().getTime());

    //get current day
    // const date = new Date();
    // const day = date.getDate();
    // const month = date.getMonth();
    // const year = date.getFullYear();
    // console.log("get current day", new Date(year, month, day));
    // console.log("get current day", new Date(year, month, day, 23, 59, 59, 0));
    const beginDate = getBeginningOfTheDay();
    const endDate = getEndingOfTheDay();
    console.log("get beginning of the day", beginDate);
    console.log("get endding of the day", endDate);
    activity = await Activity.findOneAndUpdate(
      {
        // $or: [
        //   { user: req.user.id },
        //   { rfid: req.rfid },
        //   { fingerprint: req.fingerprint },
        // ],
        // create new db if not found userId
        // $or: [
        //   { userId: checkOutCodeIdValid },
        //   { rfid: checkOutCode },
        //   { fingerprint: checkOutCode },
        // ],
        $and: [
          { userId: findPreviousCheck._id },
          {
            checkInTime: {
              $gt: beginDate,
              $lte: endDate,
            },
          },
          {
            checkOutTime: {
              $gt: beginDate,
              $lte: endDate,
            },
          },
        ],
      },

      ObjCheckInOutUpdate,

      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .populate("userId", ["name"])
      .exec();
    console.log("update", { activity });
    // test what's going on in data
    // const activityData = await Activity.findOne({
    //   userId: findPreviousCheck._id,
    // });
    // console.log(
    //   "🚀 ~ file: activity.js ~ line 91 ~ router.post ~ activityData",
    //   activityData.checkOutTime,
    //   beginDate,
    //   activityData.checkOutTime > beginDate
    // );

    console.log(
      "🚀 ~ file: activity.js ~ line 135 ~ router.post ~ ObjCheckInOutUpdate",
      ObjCheckInOutUpdate
    );

    if (!activity) {
      return res.status(404).send("activity Not Found");
    }
    return res.json({ activity });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;

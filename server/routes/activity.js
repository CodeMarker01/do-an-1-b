const express = require("express");
const router = express.Router();
const moment = require("moment");
const fileSystem = require("fs");
const fastcsv = require("fast-csv");

const { authCheck, adminCheck } = require("../middlewares/auth");
const User = require("../models/user");
const Activity = require("../models/activity");
const {
  isValidDate,
  getBeginningOfTheDay,
  getEndingOfTheDay,
  renameKey,
  getBeginningOfTheWeek,
  getEnddingOfTheWeek,
  getBeginningOfTheMonth,
  getEnddingOfTheMonth,
  formatTimeVi,
  formatDateVi,
} = require("../utils");

// @route    POST api/user/check-in-out
// @desc     Create or update user profile
// @access   Public (test)
//"checkInTime":"2018-12-30T05:59:00"
/**
 * LOGIC:
 */

router.post("/user/check-in-out", async (req, res) => {
  const { checkInTime, checkOutTime, checkOutCode } = req.body;

  //create an Object to save checkInTime, checkOutTime, checkOutCode
  // const ObjCheckInOutUpdate = {};

  // get checkInTime, checkOutTime from REQ, check if idValidDate then save into Object
  // if (checkInTime && isValidDate(checkInTime)) {
  //   // const checkInTimeDate = (checkInTime);
  //   ObjCheckInOutUpdate.checkInTime = new Date(checkInTime);
  // }
  // if (checkOutTime && isValidDate(checkOutTime)) {
  //   // const checkOutTimeDate = new Date(checkOutTime);
  //   ObjCheckInOutUpdate.checkOutTime = new Date(checkOutTime);
  // }
  // if (ObjCheckInOutUpdate.checkInTime && ObjCheckInOutUpdate.checkOutTime) {
  //   ObjCheckInOutUpdate.workingTime = parseFloat(
  //     Math.abs(
  //       ObjCheckInOutUpdate.checkInTime - ObjCheckInOutUpdate.checkOutTime
  //     ) / 3600000
  //   ).toFixed(1);
  //   //   const diffTime = Math.abs(checkOutTimeDate - checkInTimeDate) / 3600000;
  // }

  // // check checkOutCode is valid for ObjectId, if not create ObjectId format for exceptioin
  // const ObjectId = require("mongoose").Types.ObjectId;
  // let checkOutCodeIdValid = "123456789012";
  // if (ObjectId.isValid(checkOutCode)) {
  //   checkOutCodeIdValid = ObjectId(
  //     checkOutCode.length < 12 ? "123456789012" : checkOutCode
  //   );
  // }
  // console.log("Object Id checkout-->", checkOutCodeIdValid);
  // console.log("ObjCheckInOutUpdate", ObjCheckInOutUpdate);
  // You should make string 'param' as ObjectId type. To avoid exception,
  // the 'param' must consist of more than 12 characters.

  try {
    //find userId with fingerprint or rfid
    // const findPreviousCheckUser = await User.findOne({
    //   $or: [
    //     { _id: checkOutCodeIdValid },
    //     { fingerprint: checkOutCode },
    //     { rfid: checkOutCode },
    //   ],
    // }).exec();
    // console.log(
    //   "🚀 ~ file: profile.js ~ line 82 ~ router.post ~ findPreviousCheckUser",
    //   findPreviousCheckUser
    // );
    // // find all activity with current
    // const findPreviousCheckActivite = await Activity.find({
    //   userId: findPreviousCheckUser._id,
    // });
    // console.log(
    //   "🚀 ~ file: activity.js ~ line 67 ~ router.post ~ findPreviousCheckActivite",
    //   findPreviousCheckActivite
    // );
    //add userId to Object
    // ObjCheckInOutUpdate.userId = findPreviousCheckUser._id;
    // ObjCheckInOutUpdate.username = findPreviousCheckUser.name;

    // find checkInTime, checkOutTime in activity
    // if (findPreviousCheckActivite.length >= 1) {
    //   const { checkInTime, checkOutTime } =
    //     findPreviousCheckActivite[findPreviousCheckActivite.length - 1];

    //   if (!ObjCheckInOutUpdate.checkInTime) {
    //     ObjCheckInOutUpdate.checkInTime = new Date(checkInTime);
    //   }
    //   if (!ObjCheckInOutUpdate.checkOutTime) {
    //     ObjCheckInOutUpdate.checkOutTime = new Date(checkOutTime);
    //   }
    // } else {
    //   // ObjCheckInOutUpdate.checkOutTime = ObjCheckInOutUpdate.checkInTime;
    //   ObjCheckInOutUpdate.checkOutTime = null;
    // }
    // if (ObjCheckInOutUpdate.checkInTime && ObjCheckInOutUpdate.checkOutTime) {
    //   ObjCheckInOutUpdate.workingTime = parseFloat(
    //     Math.abs(
    //       ObjCheckInOutUpdate.checkInTime - ObjCheckInOutUpdate.checkOutTime
    //     ) / 3600000
    //   ).toFixed(1);
    // } else {
    //   ObjCheckInOutUpdate.workingTime = null;
    // }
    // console.log(
    //   "🚀 ~ file: activity.js ~ line 106 ~ router.post ~ ObjCheckInOutUpdate",
    //   ObjCheckInOutUpdate
    // );

    // let activity;

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
    // const beginDate = getBeginningOfTheDay(req.body.checkInTime);
    // const endDate = getEndingOfTheDay(req.body.checkInTime);
    // console.log("get beginning of the day", beginDate);
    // console.log("get endding of the day", endDate);

    // todo test
    //* check today
    // let isCheckInToday =
    //   ObjCheckInOutUpdate.checkInTime > beginDate &&
    //   ObjCheckInOutUpdate.checkInTime <= endDate
    //     ? true
    //     : false;
    // console.log(
    //   "🚀 ~ file: activity.js ~ line 144 ~ //.toDate ~ isCheckInToday",
    //   isCheckInToday
    // );

    // let isCheckOutToday =
    //   ObjCheckInOutUpdate.checkOutTime > beginDate &&
    //   ObjCheckInOutUpdate.checkOutTime <= endDate
    //     ? true
    //     : false;
    // console.log(
    //   "🚀 ~ file: activity.js ~ line 151 ~ //.toDate ~ isCheckOutToday",
    //   isCheckOutToday
    // );

    // //* check if null
    // let isCheckInNull = !ObjCheckInOutUpdate.checkInTime ? true : false;
    // console.log(
    //   "🚀 ~ file: activity.js ~ line 143 ~ //.toDate ~ isCheckInNull",
    //   isCheckInNull
    // );
    // let isCheckOutNull = !ObjCheckInOutUpdate.checkOutTime ? true : false;
    // console.log(
    //   "🚀 ~ file: activity.js ~ line 145 ~ //.toDate ~ isCheckOutNull",
    //   isCheckOutNull
    // );

    //* null but use new Date (null) -> 1/1/1970
    // let isCheckInFirstDay =pomo
    //   ObjCheckInOutUpdate.checkInTime == new Date(null) ? true : false;
    // let isCheckOutFirstDay =
    //   ObjCheckInOutUpdate.checkOutTime == new Date(null) ? true : false;
    // console.log(
    //   "🚀 ~ file: activity.js ~ line 187 ~ //.toDate ~ new Date(null)",
    //   new Date(null)
    // );

    //todo checkIn v2
    const ObjCheckInOutUpdate = {};
    let activity;

    // check checkOutCode is valid for ObjectId, if not create ObjectId format for exceptioin
    // check xem co checkOutCode ko
    if (!checkOutCode) {
      return res.status(404).send("not found fingerprint or RFID code");
    }
    const ObjectId = require("mongoose").Types.ObjectId;
    let checkOutCodeIdValid = "123456789012";
    if (ObjectId.isValid(checkOutCode)) {
      checkOutCodeIdValid = ObjectId(
        checkOutCode.length < 12 ? "123456789012" : checkOutCode
      );
    }

    // khi co checkOUtCode tim userId theo checkOutCode
    //find userId with fingerprint or rfid
    const findPreviousCheckUser = await User.findOne({
      $or: [
        { _id: checkOutCodeIdValid },
        { fingerprint: checkOutCode },
        { rfid: checkOutCode },
      ],
    }).exec();
    console.log(
      "🚀 ~ file: profile.js ~ line 82 ~ router.post ~ findPreviousCheckUser",
      findPreviousCheckUser
    );
    if (!findPreviousCheckUser) {
      return res.status(404).send("User not found!");
    }

    // find all activity with current
    // tim tat ca activity theo user hien tai
    const findPreviousCheckActivite = await Activity.find({
      userId: findPreviousCheckUser._id,
    });
    console.log(
      "🚀 ~ file: activity.js ~ line 67 ~ router.post ~ findPreviousCheckActivite",
      findPreviousCheckActivite
    );

    ObjCheckInOutUpdate.userId = findPreviousCheckUser._id;
    ObjCheckInOutUpdate.username = findPreviousCheckUser.name;
    if (checkInTime && isValidDate(checkInTime)) {
      const beginDate = getBeginningOfTheDay(req.body.checkInTime);
      const endDate = getEndingOfTheDay(req.body.checkInTime);
      ObjCheckInOutUpdate.checkInTime = checkInTime;
      ObjCheckInOutUpdate.date = checkInTime;

      activity = await Activity.findOneAndUpdate(
        {
          // tim userId tuong ung
          userId: findPreviousCheckUser._id,
          // tim checkIn da co trong day chua
          checkInTime: {
            $gte: beginDate,
            $lte: endDate,
          },
        },
        { $set: ObjCheckInOutUpdate },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
        .populate("userId", ["name"])
        .exec();
    } else if (checkOutTime && isValidDate(checkOutTime)) {
      const beginDate = getBeginningOfTheDay(req.body.checkOutTime);
      const endDate = getEndingOfTheDay(req.body.checkOutTime);
      ObjCheckInOutUpdate.checkOutTime = checkOutTime;

      activity = await Activity.findOneAndUpdate(
        {
          // tim userId tuong ung
          userId: findPreviousCheckUser._id,
          // tim checkIn da co trong day chua
          $or: [
            {
              checkInTime: {
                $gte: beginDate,
                $lte: endDate,
              },
            },
            {
              checkOutTime: {
                $gte: beginDate,
                $lte: endDate,
              },
            },
          ],
        },
        { $set: ObjCheckInOutUpdate },
        { new: true }
      )
        .populate("userId", ["name"])
        .exec();
    }
    // if (
    //   (isCheckInToday || isCheckInNull) &&
    //   (isCheckOutToday || isCheckOutNull)
    // ) {
    //   //todo end checkIn v2

    //   console.log(
    //     "🚀 ~ file: activity.js ~ line 166 ~ router.post ~ isCheckInToday",
    //     isCheckInToday
    //   );
    //   console.log("today");
    //   activity = await Activity.findOneAndUpdate(
    //     {
    //       userId: findPreviousCheckUser._id,
    //       $or: [
    //         {
    //           checkInTime: {
    //             $gt: beginDate,
    //             $lte: endDate,
    //           },
    //         },
    //         {
    //           checkOutTime: {
    //             $gt: beginDate,
    //             $lte: endDate,
    //           },
    //         },
    //       ],
    //     },
    //     { $set: ObjCheckInOutUpdate },
    //     { new: true, upsert: true, setDefaultsOnInsert: true }
    //   )
    //     .populate("userId", ["name"])
    //     .exec();
    // } else {
    //   console.log("not today");
    //   activity = await new Activity({
    //     ...ObjCheckInOutUpdate,
    //   })
    //     .save()
    //     .populate("userId", ["name"])
    //     .exec();
    //   // }
    //   // else {
    //   const date = new Date();
    //   const day = date.getDate();
    //   // console.log("🚀 ~ file: activity.js ~ line 201 ~ router.post ~ day", day);
    //   const month = date.getMonth();
    //   const year = date.getFullYear();
    //   // console.log(
    //   //   `🚀 ~ file: activity.js ~ line 196 ~ router.post ~ date --> Must check In/Out on today: ${day}/${month}/${year}`
    //   // );
    //   return res.status(400).json({
    //     errors: [
    //       { msg: `Must check In/Out on today: ${day}/${month + 1}/${year}` },
    //     ],
    //   });
    // }
    // const testActivity = await Activity.findOne({
    //   userId: findPreviousCheckUser._id,

    //   checkInTime: {
    //     $gt: beginDate,
    //     $lte: endDate,
    //   },

    //   checkOutTime: {
    //     $gt: beginDate,
    //     $lte: endDate,
    //   },
    // });
    // console.log(
    //   "🚀 ~ file: activity.js ~ line 125 ~ router.post ~ testActivity",
    //   testActivity
    // );

    //todo end test

    console.log("update", { activity });
    // test what's going on in data
    // const activityData = await Activity.findOne({
    //   _id: activity._id,
    // });
    // console.log(
    //   "🚀 ~ file: activity.js ~ line 91 ~ router.post ~ activityData",
    //   activityData.checkOutTime,
    //   beginDate,
    //   activityData.checkOutTime > beginDate
    // );
    // console.log(
    //   `checkInTime ${activityData.checkInTime} > beginDate ${beginDate} is :: ${
    //     activityData.checkInTime > beginDate
    //   }`
    // );
    // console.log(
    //   `checkInTime ${activityData.checkInTime} < endDate ${endDate} is :: ${
    //     activityData.checkInTime < endDate
    //   }`
    // );
    // console.log(
    //   `checkOutTime ${
    //     activityData.checkOutTime
    //   } > beginDate ${beginDate} is :: ${activityData.checkOutTime > beginDate}`
    // );
    // console.log(
    //   `checkOutTime ${activityData.checkOutTime} < endDate ${endDate} is :: ${
    //     activityData.checkOutTime < endDate
    //   }`
    // );

    console.log(
      "🚀 ~ file: activity.js ~ line 135 ~ router.post ~ ObjCheckInOutUpdate",
      ObjCheckInOutUpdate
    );

    // add name to activity
    // activity.username = await "test";
    // console.log("acitivity cuoc song", activity);
    // console.log("acitivity cuoc song", activity.username);

    if (!activity) {
      return res.status(404).send("activity Not Found");
    }
    return res.json({ activity });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route    GET api/user/check-in-out
// @desc     Get 1 user activity closest day with user email & password
// @access   Public (test) / User Only
router.get("/user/check-in-out", async (req, res) => {});

// @route    GET api/user/check-in-out-all
// @desc     Get all user activity closest day with user email & password
// @access   Public (test) / User Only
router.get(
  "/user/check-in-out/all",
  authCheck,
  adminCheck,
  async (req, res) => {
    try {
      const users = await User.find();
      // users.map((user) => {
      //   console.log("user._id", user._id);
      // });
      // console.log("🚀 ~ file: activity.js ~ line 270 ~ users", users);
      // const data = JSON.parse(JSON.stringify(users, ["_id", "name", "email"]));
      //* userFilter less infomation
      // const usersFilter = users.map((user) => {
      //   return {
      //     name: user.name,
      //     id: user._id,
      //     email: user.email,
      //     test: "quang dep trai",
      //   };
      // });
      const activityPerUser = await Promise.all(
        users.map(async (user) => {
          const activity = await Activity.find({
            userId: { $in: user._id },
          })
            .sort([["createdAt", "desc"]])
            .limit(1)
            .populate("userId", ["name", "email", "avatar"])
            .exec();
          return activity;
        })
      );
      // console.log(
      //   "🚀 ~ file: activity.js ~ line 289 ~ activityPerUser",
      //   activityPerUser
      // );
      // const activityUser1 = await Activity.findOne({
      //   userId: users[users.length - 1]._id,
      // })
      //   .populate("userId", ["name", "email"])
      //   .exec();

      //* remove outer array to object
      //* data = [[{time:1,speed:50}],[{time:2,speed53}]]
      //* -> data = [{time:1,speed:50},{time:2,speed:53}]
      const activityPerUserArrayObject = activityPerUser.map((row) => {
        if (Array.isArray(row)) {
          return (row = row[0]);
        }
        return;
      });

      // filter null, undefined value
      let activityPerUserArrayObjectFilter = activityPerUserArrayObject.filter(
        (a) => a
      );

      res.json(activityPerUserArrayObjectFilter);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/user/check-in-out-week
// @desc     Get all activity in current week for 1 user
// @access   Public (test) / User Only
router.get("/user/check-in-out/week", authCheck, async (req, res) => {
  const beginWeek = getBeginningOfTheWeek(new Date());
  const endWeek = getEnddingOfTheWeek(new Date());

  const { id } = req.user;
  console.log("id", id);
  try {
    // console.log(req.user.id);
    const activity = await Activity.find({
      userId: { $in: id },
      checkInTime: {
        $gt: beginWeek,
        $lt: endWeek,
      },
    });
    res.json(activity);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route    GET api/user/check-in-out-week
// @desc     Get all activity in current week for 1 user
// @access   Public (test) / User Only
router.get("/user/check-in-out/month", authCheck, async (req, res) => {
  const beginMonth = getBeginningOfTheMonth(new Date());
  const endMonth = getEnddingOfTheMonth(new Date());

  const { id } = req.user;
  console.log("id", id);
  try {
    // console.log(req.user.id);
    const activity = await Activity.find({
      userId: { $in: id },
      checkInTime: {
        $gt: beginMonth,
        $lt: endMonth,
      },
    });
    res.json(activity);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route    GET api/all/check-in-out/week
// @desc     Get all activity in current week for all user
// @access   Public (test) / User Only / admin page
router.get("/all/check-in-out/week", async (req, res) => {
  const beginWeek = getBeginningOfTheWeek(new Date());
  const endWeek = getEnddingOfTheWeek(new Date());
  // const { id } = req.user;
  // console.log("id", id);
  try {
    // console.log(req.user.id);
    const activity = await Activity.find({
      // userId: { $in: id },
      checkInTime: {
        $gt: beginWeek,
        $lt: endWeek,
      },
    });
    res.json(activity);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route    GET api/all/check-in-out-week
// @desc     Get all activity in current week for all user
// @access   Public (test) / User Only / admin page
router.get("/all/check-in-out/day", async (req, res) => {
  const beginDay = getBeginningOfTheDay(new Date());
  const endDay = getEndingOfTheDay(new Date());
  try {
    const activity = await Activity.find({
      checkInTime: {
        $gt: beginDay,
        $lt: endDay,
      },
    });
    res.json(activity);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route    GET api/all/check-in-out-week
// @desc     Get all activity in current week for all user
// @access   Public (test) / User Only
router.get("/all/check-in-out/month", async (req, res) => {
  const beginMonth = getBeginningOfTheMonth(new Date());
  const endMonth = getEnddingOfTheMonth(new Date());
  try {
    const activity = await Activity.find({
      checkInTime: {
        $gt: beginMonth,
        $lt: endMonth,
      },
    });
    res.json(activity);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route    GET api/user/check-in-out-all
// @desc     Get all activity in current week for 1 user
// @access   Public (test) / User Only

// @route    POST api/user/check-in-out-all
// @desc     Get all activity in current week for 1 user
// @access   Public (test) / User Only
// router.post('/user/')

// @route    POST api/user/check-in-out-all
// @desc     Get all activity in current week for 1 user
// @access   Public (test) / User Only
router.delete(
  "/activity/:activity",
  // authCheck,
  // adminCheck,
  async (req, res) => {
    console.log("REQ.PARAMS", req.params);
    console.log("REQ.PARAMS.ACTIVITYID", req.params.activity);
    try {
      const activityDeleted = await Activity.findByIdAndRemove(
        req.params.activity
      );
      if (!activityDeleted) {
        return res.status(404).send("activity Not Found");
      }
      res.json(activityDeleted);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/admin/user/check-in-out/month/${userId}
// @desc     admin can see total worked time in month on current user
// @access   Public (test) / User Only
router.get("/admin/user/check-in-out/month/:id", async (req, res) => {
  const beginMonth = getBeginningOfTheMonth(new Date());
  const endMonth = getEnddingOfTheMonth(new Date());

  const { id } = req.params;
  console.log("id", id);
  try {
    // console.log(req.user.id);
    const activity = await Activity.find({
      userId: { $in: id },
      checkInTime: {
        $gt: beginMonth,
        $lt: endMonth,
      },
    });
    res.json(activity);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route    POST api/admin/exportData/${userId}
// @desc     admin can see total worked time in month on current user
// @access   Public (test) / User Only
router.get("/admin/exportData/:userId", async (req, res) => {
  const { userId } = req.params;
  const data = [
    {
      id: 1,
      name: "Adnan",
      age: 29,
    },
    {
      id: 2,
      name: "Ali",
      age: 31,
    },
    {
      id: 3,
      name: "Ahmad",
      age: 33,
    },
  ];
  console.log("data", data);

  const activity = await Activity.find({ userId })
    .select({ checkInTime: 1, checkOutTime: 1, date: 1 })
    .lean()
    .populate("userId", ["name"])
    .exec();
  let activityFilter = [];
  activityFilter = activity
    .filter((el) => el.checkInTime !== null)
    .map((a) => {
      return {
        name: a.userId.name,
        checkIn: formatTimeVi(a.checkInTime),
        checkOut: formatTimeVi(a.checkOutTime),
        date: formatDateVi(a.checkInTime),
      };
    });

  console.log("export data", activity);
  console.log("activityFilter", activityFilter);

  const ws = fileSystem.createWriteStream("public/data.csv");
  fastcsv
    .write(activityFilter, { headers: true })
    .on("finish", function () {
      res.send(
        "<a href='/public/data.csv' download='data.csv' id='download-link'></a><script>document.getElementById('download-link').click();</script>"
      );
      // res.send(data);
    })
    .pipe(ws);
});

module.exports = router;

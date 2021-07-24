const express = require("express");
const {
  REPORT_DECLINE,
  REPORT_APPROVED,
  REPORT_FINGERPRINT,
  REPORT_FINGERPRINT_ERROR,
  REPORT_PENDING,
} = require("../constants");
const RfidOpenDoor = require("../models/rfidOpenDoor");
const User = require("../models/user");
const Activity = require("../models/activity");
const router = express.Router();
require("dotenv").config();

// @route    GET api/user/open-door
// @desc     Find rfid code in RfidOpenDoor db, if true send enable = 1
// @access   Publib
router.post("/user/open-door", async (req, res) => {
  let { rfid } = req.body;
  // const OneMinuteToMili = expireTime ? expireTime 60000;
  try {
    // check if user is guest
    const rfidUser = await RfidOpenDoor.findOne({
      rfid,
      status: { $ne: REPORT_DECLINE },
    }).populate("user", ["name"]);

    // if not found rfid
    if (!rfid) return res.status(400).json({ msg: "RFID not found" });
    rfidUser.checkOutTimeOpenDoor = Date.now();

    // check if user === guest
    /**
     * if role === "Guest", expire card in 1 minute
     * if role === "Employee", do not expire card
     */
    if (rfidUser.role === "Guest") {
      const expireCard = Math.abs(
        rfidUser.createTime - rfidUser.checkOutTimeOpenDoor
      );
      console.log(
        "🚀 ~ file: rfidOpenDoor.js ~ line 34 ~ router.post ~ expireCard",
        expireCard
      );
      console.log(
        "🚀 ~ file: rfidOpenDoor.js ~ line 37 ~ router.post ~ expireTime",
        rfidUser.expireTime
      );
      // if (expireCard > process.env.ONEMINUTETOMILLISECONDS) {
      if (expireCard > rfidUser.expireTime) {
        rfidUser.enable = 0;
        rfidUser.status = REPORT_DECLINE;
      }
    }

    if (rfidUser.status !== REPORT_APPROVED) {
      rfidUser.enable = 0;
    }
    console.log(rfidUser);

    return res.json(rfidUser);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route    POST api/user/create-guest
// @desc     Find rfid code in RfidOpenDoor db, if true send enable = 1
// @access   Publib
router.post("/user/create-guest", async (req, res) => {
  const { rfid, expireTime } = req.body;
  let expireTimeToMili = expireTime ? expireTime * 60000 : 60000;
  console.log(
    "🚀 ~ file: rfidOpenDoor.js ~ line 50 ~ router.post ~ expireTimeToMili",
    expireTimeToMili,
    typeof expireTimeToMili
  );
  try {
    // check if guest exits
    // let guestUser = await RfidOpenDoor.findOne({ rfid, enable: { $ne: 1 });
    // if (guestUser) {
    //   return res
    //     .status(400)
    //     .json({ erros: [{ msg: "This RFID is being used" }] });
    // }

    // //create new guest
    // guestUser = new RfidOpenDoor({
    //   rfid,
    //   createTimeLocalTime: new Date().toLocaleString(),
    //   createTime: Date.now(),
    //   checkOutTimeOpenDoor: Date.now(),
    // });

    //todo test v2
    // let guestUser = await RfidOpenDoor.findOne({ rfid });
    // if (guestUser) {
    //   return res
    //     .status(400)
    //     .json({ erros: [{ msg: "This RFID is being used" }] });
    // }
    let guestUser = await RfidOpenDoor.findOneAndUpdate(
      {
        rfid,
      },
      {
        rfid,
        createTimeLocalTime: new Date().toLocaleString(),
        createTime: Date.now(),
        checkOutTimeOpenDoor: Date.now(),
        enable: 1,
        expireTime: expireTimeToMili,
        status: REPORT_APPROVED,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    //todo end test v2

    //save to db
    await guestUser.save();

    //response
    console.log("Guest Created Successful");
    res.json(guestUser);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route    GET api/admin/report/fingerprint-error
// @desc     page Report hien thi nhan vien co status = fingerprintError
// @access   Publib
// @usage    Render Route
router.get("/admin/report/fingerprint-error", async (req, res) => {
  // try {
  //   const rfidUsers = await RfidOpenDoor.find({
  //     status: { $eq: REPORT_PENDING },
  //   }).populate("user");

  //   res.json(rfidUsers);
  // } catch (err) {
  //   res.status(500).send("Server Error");
  // }

  //todo test change from RfidOpenDoor -> Activity
  try {
    const rfidUsers = await Activity.find({
      status: { $eq: REPORT_PENDING },
    }).populate("userId");
    if (!rfidUsers) {
      return res.status(404).send("activity Not Found");
    }
    res.json(rfidUsers);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route    POST api/admin/report/fingerprint-error
// @desc     nhan vien report loi van tay o man hinh
// @access   Publib
// @usage    NOT USING
router.post("/admin/report/fingerprint-error", async (req, res) => {
  try {
    const { message, rfid } = req.body;
    let rfidUsers;
    if (!rfid) {
      return res.status(404).send("Card Not Found");
    }
    if (message === "fingerprint") {
      rfidUsers = await RfidOpenDoor.findOneAndUpdate(
        {
          rfid,
        },
        { status: REPORT_FINGERPRINT_ERROR },
        { new: true }
      )
        .populate("user")
        .exec();
    }

    res.json(rfidUsers);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/admin/report/fingerprint-error/approved
// @desc     admin dong y loi van tay, cho nhan vien su dung rfid de vao cua
// @access   Publib
// @usage    Render Route
router.put("/admin/report/fingerprint-error/approved", async (req, res) => {
  try {
    const { rfid } = req.body;
    if (!rfid) {
      return res.status(404).send("Card Not Found");
    }
    const rfidUsers = await RfidOpenDoor.findOneAndUpdate(
      {
        rfid,
      },
      { status: REPORT_APPROVED },
      { new: true }
    )
      .populate("user")
      .exec();

    res.json(rfidUsers);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/admin/report/fingerprint-error/approved
// @desc     admin KHONG dong y loi van tay, KHONG cho nhan vien su dung rfid de vao cua
// @access   Publib
// @usage    Render Route
router.put("/admin/report/fingerprint-error/decline", async (req, res) => {
  try {
    const { rfid } = req.body;
    if (!rfid) {
      return res.status(404).send("Card Not Found");
    }
    const rfidUsers = await RfidOpenDoor.findOneAndUpdate(
      {
        rfid,
      },
      { status: REPORT_DECLINE },
      { new: true }
    )
      .populate("user")
      .exec();

    res.json(rfidUsers);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/admin/report/fingerprint-error/approved
// @desc     admin KHONG dong y loi van tay, KHONG cho nhan vien su dung rfid de vao cua
// @access   Publib
// @usage    Render Route
router.put(
  "/admin/report/fingerprint-error/approve-or-decline",
  async (req, res) => {
    const { reportList, objIndex } = req.body;
    // console.log(req.body);
    // console.log(reportList);
    // try {
    //   if (!reportList) {
    //     return res.status(404).send("Card Not Found");
    //   }
    //   const rfidUsers = await RfidOpenDoor.findOneAndUpdate(
    //     {
    //       // rfid: reportList.rfid,
    //       _id: reportList[objIndex]._id,
    //     },
    //     { status: reportList[objIndex].status },
    //     { new: true }
    //   )
    //     .populate("user")
    //     .exec();

    //   console.log("rfidUsers", rfidUsers);
    //   console.log("reportList", reportList);
    //   res.json(reportList);
    // } catch (err) {
    //   res.status(500).send("Server Error");
    // }

    //todo test change from rfidOpenDoor -> Activity
    try {
      if (!reportList) {
        return res.status(404).send("Card Not Found");
      }
      const rfidUsers = await Activity.findOneAndUpdate(
        {
          // rfid: reportList.rfid,
          _id: reportList[objIndex]._id,
        },
        { status: reportList[objIndex].status },
        { new: true }
      )
        .populate("user")
        .exec();

      console.log("rfidUsers", rfidUsers);
      console.log("reportList", reportList);
      res.json(reportList);
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;

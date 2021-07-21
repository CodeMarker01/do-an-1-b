const express = require("express");
const RfidOpenDoor = require("../models/rfidOpenDoor");
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
    }).populate("user", ["name"]);

    // if not found rfid
    if (!rfid) return res.status(400).json({ msg: "RFID not found" });

    // check if user === guest
    /**
     * if role === "Guest", expire card in 1 minute
     * if role === "Employee", do not expire card
     */
    if (rfidUser.role === "Guest") {
      rfidUser.checkOutTimeOpenDoor = Date.now();
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
      }
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

module.exports = router;

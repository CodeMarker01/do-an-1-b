const express = require("express");
const RfidOpenDoor = require("../models/rfidOpenDoor");
const router = express.Router();
require("dotenv").config();

// @route    GET api/user/open-door
// @desc     Find rfid code in RfidOpenDoor db, if true send enable = 1
// @access   Publib
router.post("/user/open-door", async (req, res) => {
  const { rfid } = req.body;
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
      if (expireCard > process.env.ONEMINUTETOMILLISECONDS) {
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
  const { rfid } = req.body;
  try {
    // check if guest exits
    let guestUser = await RfidOpenDoor.findOne({ rfid });
    if (guestUser) {
      return res
        .status(400)
        .json({ erros: [{ msg: "This RFID is being used" }] });
    }

    //create new guest
    guestUser = new RfidOpenDoor({
      rfid,
      createTimeLocalTime: new Date().toLocaleString(),
      createTime: Date.now(),
      checkOutTimeOpenDoor: Date.now(),
    });
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

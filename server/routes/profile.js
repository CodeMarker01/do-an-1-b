const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const {
  getCurrentUsersProfile,
  createOrUpdateUserProfile,
  getAllProfile,
  getProfileByUserId,
  deleteProfile,
} = require("../controllers/profile");

const { authCheck } = require("../middlewares/auth");
const Profile = require("../models/Profile");
const User = require("../models/user");

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get("/profile/me", authCheck, getCurrentUsersProfile);

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  "/create-or-update-user-profile",
  authCheck,
  check("status", "Status is required").notEmpty(),
  check("skills", "Skills is required").notEmpty(),
  createOrUpdateUserProfile
);
// @route    POST api/profile/user/check-in-out-by-userid
// @desc     Create or update user profile
// @access   Public (test)
//"checkInTime":"2018-12-30T05:59:00"
router.post("/profile/user/check-in-out", async (req, res) => {
  const { checkInTime, checkOutTime, checkOutCode } = req.body;
  const checkInTimeDate = new Date(checkInTime);
  const checkOutTimeDate = new Date(checkOutTime);
  const diffTime = Math.abs(checkOutTimeDate - checkInTimeDate) / 3600000;
  const ObjectId = require("mongoose").Types.ObjectId;
  //   const checkOutCodeToObjectId = checkOutCode.replace(/-/g, "");
  let objId = "123456789012";
  if (ObjectId.isValid(checkOutCode)) {
    objId = ObjectId(
      checkOutCodeToObjectId.length < 12
        ? "123456789012"
        : checkOutCodeToObjectId
    );
  }
  //   const objIdValidate = ObjectId.isValid(objId) ? objIdj : "123456789012";
  console.log("checkoutcode-->", checkOutCode);
  console.log("Object Id checkout-->", objId);
  // You should make string 'param' as ObjectId type. To avoid exception,
  // the 'param' must consist of more than 12 characters.

  try {
    const profile = await User.findOneAndUpdate(
      {
        // $or: [
        //   { user: req.user.id },
        //   { rfid: req.rfid },
        //   { fingerprint: req.fingerprint },
        // ],
        $or: [
          { _id: objId },
          { rfid: checkOutCode },
          { fingerprint: checkOutCode },
        ],
      },
      {
        checkInTime: checkInTimeDate,
        checkOutTime: checkOutTimeDate,
        workingTime: diffTime,
      },
      { new: true }
    ).exec();
    console.log({ profile });
    if (!profile) {
      return res.status(404).send("Profile Not Found");
    }
    return res.json({ profile });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route    POST api/profile/user/check-in-out-by-rfid
// @desc     Create or update user profile
// @access   Public (test)
//"checkInTime":"2018-12-30T05:59:00.600Z"
router.post(
  "/profile/user/check-in-out-by-rfid",
  authCheck,
  async (req, res) => {
    const { checkInTime, checkOutTime } = req.body;
    const checkInTimeDate = new Date(checkInTime);
    const checkOutTimeDate = new Date(checkOutTime);
    const diffTime = Math.abs(checkOutTimeDate - checkInTimeDate) / 3600000;
    console.log(
      "🚀 ~ file: profile.js ~ line 40 ~ router.post ~ diffTime",
      diffTime
    );
    try {
      const profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        {
          checkInTime: checkInTimeDate,
          checkOutTime: checkOutTimeDate,
          workingTime: diffTime,
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).exec();
      console.log({ profile });
      return res.json({ profile });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get("/profile", getAllProfile);

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
// @usage    Yes
router.get("/profile/user/:user_id", getProfileByUserId);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
// @usage    Yes
router.delete("/profile", authCheck, deleteProfile);

module.exports = router;

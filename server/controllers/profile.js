const { validationResult } = require("express-validator");

//  bring in normalize to give us a proper url, regardless of what user entered
const normalize = require("normalize-url");

const User = require("../models/user");
const Profile = require("../models/Profile");

exports.getCurrentUsersProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.createOrUpdateUserProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // destructure the request
  const {
    // website,
    // skills,
    // youtube,
    // twitter,
    // instagram,
    // linkedin,
    // facebook,
    checkInTime,
    checkOutTime,
    RFID,
    fingerprint,
    // spread the rest of the fields we don't need to check
    ...rest
  } = req.body;

  // build a profile
  const profileFields = {
    user: req.user.id,
    // website:
    //   website && website !== "" ? normalize(website, { forceHttps: true }) : "",
    // skills: Array.isArray(skills)
    //   ? skills
    //   : skills.split(",").map((skill) => " " + skill.trim()),
    checkInTime: checkInTime ? checkInTime : "",
    checkOutTime: checkOutTime ? checkOutTime : "",
    ...rest,
  };

  //build profile details
  //   if (checkInTime) profileFields.checkInTime = checkInTime;
  //   if (checkOutTime) profileFields.checkOutTime = checkOutTime;
  if (RFID) profileFields.RFID = RFID;
  if (fingerprint) profileFields.fingerprint = fingerprint;

  // Build socialFields object
  //   const socialFields = { youtube, twitter, instagram, linkedin, facebook };

  // normalize social fields to ensure valid url
  //   for (const [key, value] of Object.entries(socialFields)) {
  //     if (value && value.length > 0)
  //       socialFields[key] = normalize(value, { forceHttps: true });
  //   }
  // add to profileFields
  //   profileFields.social = socialFields;

  try {
    // Using upsert option (creates new doc if no match is found):
    let profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
    return res.json({ profile });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

exports.getAllProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// can replace req -> { params: { user_id }
exports.getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    return res.status(500).send("Server Error");
  }
};

//delete all profile
exports.deleteProfile = async (req, res) => {
  try {
    // @todo - remove users ...

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

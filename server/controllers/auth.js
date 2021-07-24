const { validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const normalize = require("normalize-url");

const User = require("../models/user");
const Profile = require("../models/Profile");
const RfidOpenDoor = require("../models/rfidOpenDoor");
const Activity = require("../models/activity");
const {
  getBeginningOfTheDay,
  getEndingOfTheDay,
  isValidDate,
} = require("../utils");
const {
  REPORT_APPROVED,
  REPORT_DECLINE,
  REPORT_PENDING,
} = require("../constants");

// exports.CreateUser = async (req, res) => {
//   console.log("REQ USER", req.user);
//   // console.log("REQ USERDATA", req.userData);
//   const { name, picture, email } = req.user;
//   // const { displayName } = req.userData;

//   const user = await User.findOneAndUpdate(
//     { email },
//     { name: name, picture },
//     { new: true }
//   );
//   if (user) {
//     console.log("USER UPDATED", user);
//     res.json(user);
//   } else {
//     const newUser = await new User({
//       email,
//       name: name,
//       picture,
//     }).save();
//     console.log("USER CREATED", newUser);
//     res.json(newUser);
//   }
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ erros: erros.array() });
//   }
//   console.log(req.body);
//   res.send("User route");
// };

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    email,
    password,
    rfid,
    fingerprint,
    checkInTime,
    checkOutTime,
    position,
  } = req.body;

  const checkInTimeInit = checkInTime ? checkInTime : "not-set";
  const checkOutTimeInit = checkOutTime ? checkOutTime : "not-set";
  const workingTime = "not-set";

  try {
    //* See if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    //* Get users gravatar
    const avatar = normalize(
      gravatar.url(email, {
        s: "200", //string
        r: "pg", //rading
        d: "mm", //default image -> user icon
      }),
      { forceHttps: true }
    );

    user = new User({
      name,
      email,
      avatar,
      password,
      rfid,
      fingerprint,
      checkInTime: checkInTimeInit,
      checkOutTime: checkOutTimeInit,
      workingTime,
      position,
    });

    //* Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // add rfid to rfidOpenDoor for open door
    const rfidOpenDoor = new RfidOpenDoor({
      user: user._id,
      rfid,
      role: "Employee",
    });
    await rfidOpenDoor.save();
    console.log("save db in rfidOpenDoor", rfidOpenDoor);

    const payload = {
      user: {
        id: user._id,
      },
    };

    // save fisrt activity with checkIn, checkOut = null
    const activity = new Activity({
      userId: user._id,
      checkInTime: null,
      checkOutTime: null,
      workingTime: null,
    });
    await activity.save();
    console.log("save db in rfidOpenDoor", rfidOpenDoor);

    //* Return jsonwebtoken
    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        console.log("User Created Successful!");
        res.json({ token, name });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUserByToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.signInUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    //* See if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    //* Encrypt password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    //* Return jsonwebtoken
    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, email });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// exports.createOrUpdateUser = (req, res) => {
//   res.json({
//     data: "hey you hit create-or-update-user API endpoint",
//   });
// };

exports.remove = async (req, res) => {
  // const { productInfo, productDetail } = req.body;
  // console.log("PRODUCT INFO ID:", productInfo._id);
  // console.log("REQ :", req.params.id);
  try {
    const deleted = await User.findOneAndRemove({
      // _id: req.params.id,
      name: req.body.name,
    }).exec();
    // find user
    // const deleted = await User.findOne({
    //   name: req.body.name,
    // });
    // remove user activity
    const deletedActivity = await Activity.deleteMany({
      userId: deleted._id,
    }).exec();
    res.json(deleted);
    // const findProduct = await Product.find({ slug: req.params.slug }).exec();
    // const findProductDetail = await ProductDetail.find({
    //   productSlug: req.params.slug,
    // }).exec();
    // res.json(findProductDetail + `cuocsong`);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Product delete failed");
  }
};

//* old version
//* find activity with activityId
// exports.readOne = async (req, res) => {
//   const activity = await Activity.findOne({ _id: req.params.id })
//     .populate("userId", ["name", "email", "avatar", "position", "salary"])
//     .exec();
//   console.log(activity);
//   res.json(activity);
// };

//todo readOne v2
exports.readOne = async (req, res) => {
  console.log(req.query);
  let { userId, date } = req.query;
  if (!isValidDate(date)) {
    date = new Date(date);
  }
  console.log(date);
  const beginDate = getBeginningOfTheDay(date);
  const endDate = getEndingOfTheDay(date);

  const activity = await Activity.findOne({
    userId: userId,
    checkInTime: {
      $gte: beginDate,
      $lte: endDate,
    },
    //todo 1.test status v2
    status: { $nin: [REPORT_PENDING, REPORT_DECLINE] },
  })
    .populate("userId", ["name", "email", "avatar", "position", "salary"])
    .exec();
  if (!activity) {
    const newDate = new Date(date).setHours(0, 0, 0, 0);
    let newActivity = Activity.findOneAndUpdate(
      {
        userId: userId,
        checkInTime: {
          $gte: beginDate,
          $lte: endDate,
        },
      },
      {
        userId: userId,
        checkInTime: new Date(newDate),
        date: new Date(newDate),
        checkOutTime: null,
        workingTime: null,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .populate("userId", ["name", "email", "avatar", "position", "salary"])
      .exec();
    // await newActivity.save();
    // newActivity = await newActivity.populate("userId").execPopulate();
    return res.json(newActivity);
  }
  console.log(activity);
  res.json(activity);
};

exports.update2 = async (req, res) => {
  try {
    // desconstruct user infomation
    // can phai gui userId va activityId de update 2 ben
    const { userInfo } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userInfo.userId },
      userInfo,
      { new: true }
    ).exec();
    const updatedActivity = await Activity.findOneAndUpdate(
      {
        _id: userInfo.activityId,
      },
      userInfo,
      { new: true }
    ).exec();

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.update = async (req, res) => {
  console.log(req.body);
  const { activityObj } = req.body;
  console.log(
    "🚀 ~ file: auth.js ~ line 334 ~ exports.update= ~ activityObj",
    activityObj
  );
  const { userId } = activityObj;
  console.log(
    "🚀 ~ file: auth.js ~ line 336 ~ exports.update= ~ userId",
    userId
  );
  try {
    // update User
    console.log("activityObj.checkInTime", activityObj.checkInTime);
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId._id,
      },
      { $set: userId },
      { new: true }
    ).exec();
    console.log(
      "🚀 ~ file: auth.js ~ line 351 ~ exports.update= ~ updatedUser",
      updatedUser
    );

    const updatedActivity = await Activity.findOneAndUpdate(
      {
        _id: activityObj._id,
      },
      { $set: activityObj },
      { new: true }
    )
      .populate("userId")
      .exec();
    res.json(updatedActivity);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.newEmployees = async (req, res) => {
  // const user = await User.find({}).sort({'createAt':-1})
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).limit(5);
    console.log(users);
    res.json(users);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// exports.fingerprintErrData = async (req, res) => {
//   try {
//     const users = await User.find({})
//   } catch (err) {
//     res.status(500).send("Server Error");
//   }
// };

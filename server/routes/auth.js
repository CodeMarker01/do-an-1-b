const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const { authCheck, adminCheck } = require("../middlewares/auth");

const {
  createUser,
  getUserByToken,
  signInUser,
  getAllUsers,
  remove,
  readOne,
  update,
  newEmployees,
} = require("../controllers/auth");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// @route    POST api/create-users
// @desc     Register user
// @access   Public
router.post(
  "/create-users",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  createUser
);

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
// @desc     Yes
router.get("/auth", authCheck, getUserByToken);

// @route    GET api/auth
// @desc     Get admin by token
// @access   Private
// @desc     Yes
router.get("/auth-admin", authCheck, adminCheck, getUserByToken);

// @route    POST api/update-users
// @desc     Check emai & pass -> return token
// @access   Public
// @usage    Yes
router.post(
  "/update-users",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  signInUser
);

// @route    POST api/auth
// @desc     Check emai & pass -> return token
// @access   Public
// @usage    No
router.post(
  "/auth",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  signInUser
);

// @route    GET api/user/all
// @desc     Check emai & pass -> return token
// @access   Admin
// @usage    Yes
router.get("/users/all", authCheck, adminCheck, getAllUsers);

//import
// const { createOrUpdateUser } = require("../controllers/auth");
// router.get("/create-user", createOrUpdateUser);

// @route    DELETE api/user/:id
// @desc     Check id & delete user -> return id
// @access   Admin
// @usage    Yes
//delete product
router.post("/user/delete", remove);

// @route    GET api/user/:id
// @desc     Get 1 user base on params userId
// @access   Public
// @usage    Yes
router.get("/user/:id", readOne);

// @route    PUT api/user/:id
// @desc     Update 1 user based on params userId
// @access   Admin
// @usage    Yes
router.put("/user/:id", authCheck, adminCheck, update);
// router.put("/user/:id", update);

// @route    GET api/user/:id
// @desc     Update 1 user based on params userId
// @access   Admin
// @usage    Yes
router.get("/user/new-employees/week", newEmployees);
// router.put("/user/:id", update);

/**
 * LOGIC phan bao loi van tay : POST /api/admin/report/fingerprint-error
 * user se gui tu man hinh lenh van tay loi : {message: fingerprint, rfid: rfidCode}
 * server check if (message = fingerprint)
 *  -> tim userId
 *  -> update status: fingerprintError
 *
 * Render table trong Report page:
 *   Check neu status == fingerprintError -> render ra
 *    hien thi 2 btn approve & decline
 *    neu approve update status : approved
 *    neu decline update status : decline
 *
 * De mo cua:
 *  check neu status : $ne : decline
 */

// @route    GET api/admin/report/fingerprint-error
// @desc     Get all user with state = fingerprintErr
// @access   Admin
// @usage    Yes
// router.get("/admin/report/fingerprint-error", fingerprintErrData);

module.exports = router;

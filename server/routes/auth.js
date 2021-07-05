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

module.exports = router;

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const { authCheck } = require("../middlewares/auth");

const {
  createUser,
  getUserByToken,
  signInUser,
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
router.get("/auth", authCheck, getUserByToken);

// @route    POST api/auth
// @desc     Check emai & pass -> return token
// @access   Public
router.post(
  "/auth",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  signInUser
);

//import
const { createOrUpdateUser } = require("../controllers/auth");
router.get("/create-user", createOrUpdateUser);

module.exports = router;

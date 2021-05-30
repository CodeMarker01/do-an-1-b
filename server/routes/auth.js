const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const { authCheck } = require("../middlewares/auth");

const { createUser, getUserByToken } = require("../controllers/auth");

// @route    POST api/users
// @desc     Register user
// @access   Public

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post(
  "/users",
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

//import
const { createOrUpdateUser } = require("../controllers/auth");
router.get("/create-or-update-user", createOrUpdateUser);

module.exports = router;

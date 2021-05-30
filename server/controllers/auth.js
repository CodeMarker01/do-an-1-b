const { validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const normalize = require("normalize-url");

const User = require("../models/user");

exports.CreateUser = async (req, res) => {
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }
  console.log(req.body);
  res.send("User route");
};

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

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
    });

    //* Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

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
        res.json({ token, name });
      }
    );
  } catch (err) {
    console.error(err.message);
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

exports.createOrUpdateUser = (req, res) => {
  res.json({
    data: "hey you hit create-or-update-user API endpoint",
  });
};

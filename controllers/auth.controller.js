const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

exports.checkTokenVerified = async (_, res) => {
  try {
    res.json({ message: "token has been verified" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Try again" });
  }
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Incorrect registration data"
      });
    }

    const { email, password } = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      return res
        .status(400)
        .json({ message: "User with this email already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: "New user has been created" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Try again" });
  }
};

exports.registerMiddlewares = [
  check("email", "Incorrect email address").isEmail(),
  check("password", "Minimum 6 symbols").isLength({ min: 6 })
];

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Incorrect log in data"
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password. Try again" });
    }

    const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
      expiresIn: "1h"
    });

    res.json({
      token,
      userId: user.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginMiddlewares = [
  check("email", "Enter correct email address")
    .normalizeEmail()
    .isEmail(),
  check("password", "Enter password").exists()
];

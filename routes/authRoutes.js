const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

/**
 * REGISTER / SIGNUP
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, city } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      city
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

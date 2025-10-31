const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendVerificationEmail } = require("../utils/mailer");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ check email
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // 2️⃣ password hash
    const hash = await bcrypt.hash(password, 10);

    // 3️⃣ verification token
    const token = crypto.randomBytes(32).toString("hex");

    // 4️⃣ new user create
    const user = new User({
      name,
      email,
      passwordHash: hash,
      verifyToken: token,
      isVerified: false,
    });
    await user.save();

    // 5️⃣ mail send function call
    await sendVerificationEmail(email, name, token);

    res.status(201).json({
      message: "User registered successfully. Please check your email for verification link.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/mailer.js";
import generateToken from "../utils/generateToken.js";

// register user
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, companyName, zipCode, email, password } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !companyName ||
      !zipCode ||
      !email ||
      !password
    ) {
      return res
        .status(400)
        .json({
          message:
            "firstName,lastName,companyName,zipCode,email and password are required",
        });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      firstName,
      lastName,
      companyName,
      zipCode,
      email,
      password: hashPassword,
      isVerified: false,
      verifyToken: token,
    });

    console.log("✅ New User Created:", user.email);

    // send verification email
    try {
      await sendVerificationEmail(user.email, user.firstName, token);

      res.status(201).json({
        message:
          "User registered successfully. Please check your email for verification link.",
        userId: user._id,
      });
    } catch (mailErr) {
      console.error("Failed to send verification email:", mailErr);

      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        message:
          "Registration failed - could not send verification email. Please try again or contact support.",
        error: mailErr.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ message: "Verification token is missing" });
    }

    // find user with this token
    const user = await User.findOne({ verifyToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link" });
    }

    // optional: check if already verified
    if (user.isVerified) {
      return res
        .status(200)
        .json({ message: "Account already verified. You can log in now." });
    }

    // optional: check expiry date (if stored)
    if (user.verifyTokenExpires && user.verifyTokenExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "Verification link has expired." });
    }

    // mark verified and clear token
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    // generate login JWT
    const jwt = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now log in.",
      token: jwt,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
      },
    });
  } catch (error) {
    console.error("Email verification failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    // return user data + JWT
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if email exists or not
      return res.status(200).json({ 
        message: "If this email is registered, you will receive password reset instructions." 
      });
    }
    
    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // Save token and expiry
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, user.firstName, token);
      
      res.json({
        success: true,
        message: "Password reset instructions sent to your email"
      });
    } catch (emailError) {
      // Reset the token if email fails
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      
      console.error("Password reset email failed:", emailError);
      return res.status(500).json({ 
        message: "Failed to send password reset email. Please try again later." 
      });
    }
  } catch (error) {
    res.status(500).json({message:error.message})
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Validate input
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Password and confirmation are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset link is invalid or has expired" });
    }

    // Hash new password
    const hashPassword = await bcrypt.hash(password, 10);
    
    // Update user
    user.password = hashPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Generate new login token
    const loginToken = generateToken(user._id);

    res.json({ 
      message: "Password has been reset successfully!",
      token: loginToken,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


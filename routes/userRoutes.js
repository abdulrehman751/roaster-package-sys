import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword
} from "../controllers/userController.js";


const router = express.Router();

// 🧍‍♂️ Register route
router.post("/register", registerUser);

// login

router.post("/login", loginUser);


// ✅ Email verification route
router.get("/verify/:token", verifyEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;

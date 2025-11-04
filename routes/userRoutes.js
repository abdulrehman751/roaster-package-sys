import express from "express";
import { loginUser, registerUser, verifyEmail } from "../controllers/userController.js";

const router = express.Router();

// 🧍‍♂️ Register route
router.post("/register", registerUser);

// login

router.post("/login", loginUser);

// ✅ Email verification route
router.get("/verify/:token", verifyEmail);

export default router;

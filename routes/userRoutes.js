import express from "express";
import { registerUser, verifyEmail } from "../controllers/userController.js";

const router = express.Router();

// 🧍‍♂️ Register route
router.post("/register", registerUser);

// ✅ Email verification route
router.get("/verify/:token", verifyEmail);

export default router;

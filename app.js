import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import User from "./models/User.js";
import cors from "cors";
import { protect } from "./middleware/authMiddleware.js";
const app = express();

app.use(cors());

// OR allow specific frontend only
app.use(
  cors({
    origin: "http://localhost:3000", // frontend ka URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ verifyToken: token });

  if (!user) return res.status(400).send("Invalid token");

  user.isVerified = true;
  user.verifyToken = undefined;
  await user.save();

  res.send("Email verified successfully ✅");
});

dotenv.config();
connectDB();

console.log("MONGO_URL:", process.env.MONGO_URL);

app.use(express.json());

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// routes

app.use("/api/users", protect, userRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import User from "./models/User.js";
import cors from "cors";
import { protect } from "./middleware/authMiddleware.js";
import router from "./routes/userRoutes.js";
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

// ✅ Check user verification status
router.get("/status", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      isVerified: user.isVerified,
      message: user.isVerified ? "Email verified" : "Email not verified yet",
    });
  } catch (err) {
    console.error("Error checking verification status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


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

  app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);


app.use("/", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

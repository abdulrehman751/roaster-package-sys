import bcrypt from "bcrypt";
import User from "../models/User.js";

// register user
export const registerUser = async (req, res) => {
  try {
    const [name, email, password] = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name,email and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ messsage: "User already exists" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password atleast 6 characters" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
      verifyToken,
    });
    console.log(user, "abdulrehman");

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    await sendVerificationEmail(user.email, user.name, verifyToken);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for verification link.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verifyToken: token });

    if (!user) return res.status(400).send("Invalid or expired token");

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.send("✅ Email verified successfully. You can now log in!");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// login
export const loginUser = async (req, res) => {
  try {
    const [email, password] = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ messsage: "Invalid Credentials " });
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid Credentials" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

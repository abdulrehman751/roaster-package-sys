import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String, required: true },
    zipCode: { type: Number, required: true },
    email: { type: String, reqiured: true },
    password: { type: String, reqiured: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);

export default User;

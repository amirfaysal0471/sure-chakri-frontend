import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Google Login এর জন্য এটি false থাকবে
    },
    image: {
      type: String,
    },
    provider: {
      type: String,
      default: "credentials",
    },
    // 🔥 FIX: Google ID ফিল্ড যোগ করা হয়েছে (Duplicate Error এড়াতে)
    googleId: {
      type: String,
      unique: true,
      sparse: true, // এটি খুবই গুরুত্বপূর্ণ: যাদের googleId নেই (null), তাদের জন্য এরর দিবে না
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    plan: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },

    planExpiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);

export default User;

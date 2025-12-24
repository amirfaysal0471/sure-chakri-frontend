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
      required: false, // এটি false করতে হবে কারণ OAuth ইউজারদের পাসওয়ার্ড নেই
    },
    image: {
      type: String, // Google/GitHub প্রোফাইল পিকচারের জন্য
    },
    provider: {
      type: String, // google or credentials
      default: "credentials",
    },
    role: {
      type: String,
      enum: ["user", "admin"], // রোল শুধু user বা admin হতে পারবে
      default: "user", // ডিফল্ট ভ্যালু user
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);

export default User;

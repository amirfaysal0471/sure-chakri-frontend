import User from "@/app/models/User";
import connectDB from "@/lib/db";

// 1. Get Single User by ID
export const getUserById = async (id: string) => {
  await connectDB();
  const user = await User.findById(id).select("-password").lean();
  if (!user) return null;

  // _id কে স্ট্রিং-এ কনভার্ট করে রিটার্ন করা (Frontend Safety)
  return {
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt?.toString(),
    updatedAt: user.updatedAt?.toString(),
    // Date অবজেক্ট স্ট্রিং এ কনভার্ট করা
    planExpiresAt: user.planExpiresAt?.toString() || null,
  };
};

// 2. Update User (Plan, Role, Expiration Logic)
export const updateUser = async (id: string, updateData: any) => {
  await connectDB();

  // 🔥 ডায়নামিক ডেট ক্যালকুলেশন লজিক
  // যদি রিকোয়েস্টে প্ল্যান পরিবর্তনের তথ্য থাকে
  if (updateData.plan) {
    const today = new Date();

    if (updateData.plan === "free") {
      // ফ্রী প্ল্যানের কোনো মেয়াদ নেই
      updateData.planExpiresAt = null;
    } else {
      // যদি duration "yearly" হয় তাহলে ১ বছর, না হলে ডিফল্ট ১ মাস
      if (updateData.duration === "yearly") {
        today.setFullYear(today.getFullYear() + 1); // +1 Year
      } else {
        today.setMonth(today.getMonth() + 1); // +1 Month (Default)
      }
      updateData.planExpiresAt = today;
    }

    // duration ফিল্ডটি ডাটাবেস স্কিমাতে নেই, তাই এটি রিমুভ করে দিচ্ছি
    // যাতে Mongoose "strict mode" এ কোনো ওয়ার্নিং না দেয়
    delete updateData.duration;
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true } // আপডেটেড ডাটা রিটার্ন করবে
  ).select("-password");

  return updatedUser;
};

// 3. Delete User
export const deleteUser = async (id: string) => {
  await connectDB();
  const deletedUser = await User.findByIdAndDelete(id);
  return deletedUser;
};

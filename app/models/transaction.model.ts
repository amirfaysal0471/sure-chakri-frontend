import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // রেফারেন্সও থাকবে
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PricingPlan",
      required: true,
    },

    // 🔥 নতুন ফিল্ড: সরাসরি নাম সেভ করার জন্য
    planName: { type: String },

    paymentMethod: { type: String, required: true },
    senderNumber: { type: String, required: true },
    trxId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    billingCycle: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // 🔥 FIX: String এর বদলে ObjectId এবং Ref ব্যবহার করা হয়েছে
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PricingPlan", // PricingPlan মডেলের সাথে লিংক
      required: true,
    },

    paymentMethod: { type: String, required: true },
    senderNumber: { type: String, required: true },
    trxId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    billingCycle: { type: String }, // monthly/yearly
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

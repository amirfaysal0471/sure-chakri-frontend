import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Bkash, Nagad
    logo: { type: String }, // Optional URL
    accountType: { type: String, default: "Personal" }, // Personal / Merchant
    accountNumber: { type: String, required: true },
    instruction: { type: String }, // "Send Money to..."
    charge: { type: Number, default: 0 }, // Extra charge (e.g. 1.85%)
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.PaymentMethod ||
  mongoose.model("PaymentMethod", paymentMethodSchema);

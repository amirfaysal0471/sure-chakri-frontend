import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  name: string;
  phone: string;
  email: string;
  department: "support" | "billing" | "exam" | "general";
  message: string;
  status: "new" | "read" | "replied" | "closed";
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    department: {
      type: String,
      enum: ["support", "billing", "exam", "general"],
      default: "general",
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "replied", "closed"],
      default: "new",
    },
    adminNote: { type: String },
  },
  { timestamps: true }
);

const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", contactSchema);

export default Contact;

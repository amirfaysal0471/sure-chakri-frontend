import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestionBankCategory extends Document {
  name: string;
  type: string; // e.g., BCS, Bank, Primary
  totalQuestions: number;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const QuestionBankCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, index: true },
    totalQuestions: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// Prevent overwriting model if already compiled
const QuestionBankCategory: Model<IQuestionBankCategory> =
  mongoose.models.QuestionBankCategory ||
  mongoose.model<IQuestionBankCategory>(
    "QuestionBankCategory",
    QuestionBankCategorySchema
  );

export default QuestionBankCategory;

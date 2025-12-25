import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestion extends Document {
  categoryId: mongoose.Types.ObjectId;
  questionText: string;
  options: string[];
  correctAnswer: number; // ⚠️ Change: String -> Number (Index)
  explanation?: string;
  marks: number;
  status: "Active" | "Inactive";
}

const QuestionSchema: Schema = new Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionBankCategory",
      required: true,
    },
    questionText: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: (v: string[]) => v.length >= 2,
    },
    // ⚠️ Change: টাইপ Number করা হয়েছে যাতে Index (0,1,2,3) সেভ হয়
    correctAnswer: { type: Number, required: true },
    explanation: { type: String },
    marks: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Question: Model<IQuestion> =
  mongoose.models.Question ||
  mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;

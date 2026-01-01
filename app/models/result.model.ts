import mongoose, { Schema, Document, models } from "mongoose";

export interface IResult extends Document {
  user: mongoose.Types.ObjectId;
  exam: mongoose.Types.ObjectId;
  totalMarks: number;
  obtainedMarks: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  isPassed: boolean;
  // বিস্তারিত উত্তরপত্র (Result Page এ দেখানোর জন্য)
  details: {
    questionId: mongoose.Types.ObjectId;
    userSelectedOptionIndex: number | null; // null if skipped
    correctOptionIndex: number;
    isCorrect: boolean;
  }[];
}

const ResultSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    exam: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    totalMarks: { type: Number, required: true },
    obtainedMarks: { type: Number, required: true },
    correctCount: { type: Number, default: 0 },
    wrongCount: { type: Number, default: 0 },
    skippedCount: { type: Number, default: 0 },
    isPassed: { type: Boolean, required: true },

    details: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: "Question" },
        userSelectedOptionIndex: { type: Number, default: null },
        correctOptionIndex: { type: Number },
        isCorrect: { type: Boolean },
      },
    ],
  },
  { timestamps: true }
);

const Result = models.Result || mongoose.model<IResult>("Result", ResultSchema);
export default Result;

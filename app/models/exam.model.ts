import mongoose, { Schema, Document } from "mongoose";

export interface IExam extends Document {
  title: string;
  topic: string; // Syllabus
  examDate: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  examCategoryId: mongoose.Types.ObjectId; // BCS, Bank Job etc.
  status: "Draft" | "Upcoming" | "Live" | "Ended";
  isPremium: boolean;
  questions: mongoose.Types.ObjectId[]; // Array of Question IDs
  totalMarks: number;
}

const ExamSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    topic: { type: String, required: true },
    examDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    examCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamCategory",
      required: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Upcoming", "Live", "Ended"],
      default: "Draft",
    },
    isPremium: { type: Boolean, default: false },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    totalMarks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Exam = mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema);
export default Exam;

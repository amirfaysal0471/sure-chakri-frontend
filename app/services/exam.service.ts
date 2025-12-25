import Exam, { IExam } from "@/app/models/exam.model";
import connectDB from "@/lib/db";

/**
 * Helper to serialize Mongoose documents for Next.js Client/Server boundary.
 */
const serialize = <T>(data: T): T => JSON.parse(JSON.stringify(data));

export const createExam = async (data: Partial<IExam>) => {
  await connectDB();
  const newExam = await Exam.create(data);
  return serialize(newExam);
};

export const getAllExams = async () => {
  await connectDB();
  const exams = await Exam.find()
    .populate("examCategoryId", "name")
    .sort({ createdAt: -1 })
    .lean();
  return serialize(exams);
};

export const getExamById = async (id: string) => {
  await connectDB();
  const exam = await Exam.findById(id)
    .populate("examCategoryId", "name")
    .populate("questions")
    .lean();
  return serialize(exam);
};

export const updateExam = async (id: string, data: Partial<IExam>) => {
  await connectDB();
  const updatedExam = await Exam.findByIdAndUpdate(id, data, { new: true });
  return serialize(updatedExam);
};

export const deleteExam = async (id: string) => {
  await connectDB();
  const deletedExam = await Exam.findByIdAndDelete(id);
  return serialize(deletedExam);
};

import Exam, { IExam } from "@/app/models/exam.model";
import connectDB from "@/lib/db";

// 👇 IMPORTANT: Import the referenced models here to ensure they are registered
import "@/app/models/examCategory.model";
// If you have a Question model, import it too, otherwise getExamById will fail later
// import "@/app/models/question.model";

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
  // Now Mongoose knows what "ExamCategory" is because we imported it above
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
    .populate("questions") // Ensure Question model is also imported if this exists
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

export const getPublicExams = async () => {
  await connectDB();

  // 🔥 শুধুই পাবলিক ডাটা আনা হচ্ছে
  const exams = await Exam.find({ status: { $ne: "Draft" } }) // ড্রাফট বাদে সব
    .select("-questions") // ❌ প্রশ্ন লোড হবে না (নিরাপদ)
    .populate("examCategoryId", "name icon color") // ক্যাটাগরি নাম সহ
    .sort({ examDate: 1 }) // তারিখ অনুযায়ী সাজানো
    .lean();

  return serialize(exams);
};

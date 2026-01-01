import Exam, { IExam } from "@/app/models/exam.model";
import connectDB from "@/lib/db";

// 🔥 FIX: Result মডেল ইমপোর্ট করা হলো
import Result from "@/app/models/result.model";

// 👇 IMPORTANT: Import referenced models to ensure they are registered
import "@/app/models/examCategory.model";
import "@/app/models/question.models";

/**
 * Helper to serialize Mongoose documents for Next.js Client/Server boundary.
 */
const serialize = <T>(data: T): T => JSON.parse(JSON.stringify(data));

// Create Exam
export const createExam = async (data: Partial<IExam>) => {
  await connectDB();
  const newExam = await Exam.create(data);
  return serialize(newExam);
};

// Get All Exams (Admin List)
export const getAllExams = async () => {
  await connectDB();
  const exams = await Exam.find()
    .populate("examCategoryId", "name")
    .sort({ createdAt: -1 })
    .lean();
  return serialize(exams);
};

// Get Single Exam (Admin View - With Answers)
export const getExamById = async (id: string) => {
  await connectDB();
  const exam = await Exam.findById(id)
    .populate("examCategoryId", "name")
    .populate("questions")
    .lean();
  return serialize(exam);
};

// Update Exam
export const updateExam = async (id: string, data: Partial<IExam>) => {
  await connectDB();
  const updatedExam = await Exam.findByIdAndUpdate(id, data, { new: true });
  return serialize(updatedExam);
};

// Delete Exam
export const deleteExam = async (id: string) => {
  await connectDB();
  const deletedExam = await Exam.findByIdAndDelete(id);
  return serialize(deletedExam);
};

// Get Public Exams List (For Routine/Schedule)
export const getPublicExams = async () => {
  await connectDB();
  const exams = await Exam.find({ status: { $ne: "Draft" } })
    .select("-questions")
    .populate("examCategoryId", "name icon color")
    .sort({ examDate: 1 })
    .lean();
  return serialize(exams);
};

// 🔥 NEW: Get Single Exam (Student View - SECURE/NO ANSWERS + VALIDATION)
export const getExamByIdForStudent = async (id: string, userId: string) => {
  await connectDB();

  // 1. আগে চেক করি ইউজার ইতিমধ্যে পরীক্ষা দিয়েছে কিনা
  // (এই লাইনটিতেই এরর আসছিল কারণ Result ইমপোর্ট করা ছিল না)
  const existingResult = await Result.findOne({ exam: id, user: userId })
    .select("_id")
    .lean();

  if (existingResult) {
    // ⛔ যদি পরীক্ষা দিয়ে থাকে, তবে প্রশ্ন পাঠানোর দরকার নেই
    return {
      hasSubmitted: true,
      resultId: existingResult._id, // রেজাল্ট পেজে রিডাইরেক্ট করার জন্য ID
    };
  }

  // 2. Fetch Exam & Populate Questions
  const exam = await Exam.findById(id)
    .populate({
      path: "questions",
      select: "-__v", // Exclude metadata from questions
    })
    .select("-createdAt -updatedAt -__v") // Exclude metadata from exam
    .lean();

  if (!exam) return null;

  // 3. Prevent access to Draft exams
  if (exam.status === "Draft") {
    throw new Error("This exam is not available yet.");
  }

  // 4. SANITIZE DATA: Remove correct answers from questions
  const sanitizedQuestions = exam.questions.map((q: any) => {
    let safeOptions = q.options;

    // If options contain 'isCorrect' flag, remove it (if using object structure)
    if (Array.isArray(q.options) && typeof q.options[0] === "object") {
      safeOptions = q.options.map((opt: any) => ({
        _id: opt._id,
        text: opt.text,
        image: opt.image,
        // ❌ isCorrect removed
      }));
    }

    return {
      _id: q._id,
      text: q.questionText || q.title,
      options: safeOptions,
      marks: q.marks,
      type: q.type,
      // ❌ correctOption/answer removed
    };
  });

  // 5. Return secure object
  return serialize({
    ...exam,
    questions: sanitizedQuestions,
    hasSubmitted: false, // ✅ ফ্ল্যাগ অ্যাড করা হলো
  });
};

export const republishExam = async (
  oldExamId: string,
  newDates: { examDate: Date; startTime: string; endTime: string }
) => {
  await connectDB();

  // ১. পুরোনো এক্সাম খুঁজে বের করা
  const oldExam = await Exam.findById(oldExamId).lean();

  if (!oldExam) {
    throw new Error("Exam not found");
  }

  // ২. অপ্রয়োজনীয় ফিল্ড রিমুভ করা (_id, createdAt, updatedAt)
  const { _id, createdAt, updatedAt, ...examData } = oldExam;

  // ৩. নতুন এক্সাম অবজেক্ট তৈরি (নতুন ডেট সহ)
  const newExamPayload = {
    ...examData,
    title: `${examData.title} (Republished)`, // চাইলে টাইটেল চেঞ্জ করতে পারেন
    examDate: newDates.examDate,
    startTime: newDates.startTime,
    endTime: newDates.endTime,
    status: "Upcoming", // স্ট্যাটাস রিসেট
    questions: examData.questions, // আগের প্রশ্নগুলোই থাকবে
  };

  // ৪. নতুন এক্সাম ডাটাবেসে সেভ করা
  const newExam = await Exam.create(newExamPayload);

  return JSON.parse(JSON.stringify(newExam));
};

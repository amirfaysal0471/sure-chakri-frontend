import Question, { IQuestion } from "@/app/models/question.models";
import connectDB from "@/lib/db";

// Create
export const createQuestion = async (data: Partial<IQuestion>) => {
  await connectDB();
  return await Question.create(data);
};

// Get All with Search, Filter & Pagination
export const getQuestions = async (
  search: string,
  categoryId: string,
  page: number,
  limit: number
) => {
  await connectDB();

  const query: any = {};

  // 1. Search Logic (Case insensitive regex)
  if (search) {
    query.questionText = { $regex: search, $options: "i" };
  }

  // 2. Filter by Category
  if (categoryId && categoryId !== "all") {
    query.categoryId = categoryId;
  }

  const skip = (page - 1) * limit;

  // Fetch Data
  const questions = await Question.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("categoryId", "name") // ক্যাটাগরি নাম দেখানোর জন্য
    .lean();

  // Total Count (Pagination এর জন্য)
  const total = await Question.countDocuments(query);

  return {
    questions,
    metadata: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get Single Question by ID
export const getQuestionById = async (id: string) => {
  await connectDB();
  return await Question.findById(id).populate("categoryId", "name").lean();
};

// Update Question
export const updateQuestion = async (id: string, data: Partial<IQuestion>) => {
  await connectDB();
  return await Question.findByIdAndUpdate(id, data, { new: true });
};

// Delete Question
export const deleteQuestion = async (id: string) => {
  await connectDB();
  return await Question.findByIdAndDelete(id);
};

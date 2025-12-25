import QuestionBankCategory, {
  IQuestionBankCategory,
} from "@/app/models/questionBankCategories.models";
import connectDB from "@/lib/db";

export const createCategory = async (data: Partial<IQuestionBankCategory>) => {
  await connectDB();
  return await QuestionBankCategory.create(data);
};

export const getAllCategories = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  type: string = "All"
) => {
  await connectDB();
  const query: any = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (type !== "All") query.type = type;

  const skip = (page - 1) * limit;

  const categories = await QuestionBankCategory.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await QuestionBankCategory.countDocuments(query);
  return { categories, total, totalPages: Math.ceil(total / limit) };
};

export const getCategoryById = async (id: string) => {
  await connectDB();
  return await QuestionBankCategory.findById(id);
};

export const updateCategory = async (
  id: string,
  data: Partial<IQuestionBankCategory>
) => {
  await connectDB();
  return await QuestionBankCategory.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const deleteCategory = async (id: string) => {
  await connectDB();
  return await QuestionBankCategory.findByIdAndDelete(id);
};

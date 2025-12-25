import Question, { IQuestion } from "@/app/models/question.models";
import connectDB from "@/lib/db";
// import Question, { IQuestion } from "@/models/question.models";

export const createQuestion = async (data: Partial<IQuestion>) => {
  await connectDB();
  return await Question.create(data);
};

import connectDB from "@/lib/db";
import Exam from "@/app/models/exam.model";
import Result from "@/app/models/result.model";
import "@/app/models/question.models";
interface SubmitPayload {
  userId: string;
  examId: string;
  answers: Record<string, number>; // { "questionId": optionIndex }
}

export const submitExamResult = async ({
  userId,
  examId,
  answers,
}: SubmitPayload) => {
  await connectDB();

  // ১. এক্সাম এবং প্রশ্নগুলো লোড করা
  const exam = await Exam.findById(examId).populate("questions").lean();

  if (!exam) throw new Error("Exam not found");

  // --- ভেরিয়েবল ইনিশিয়ালাইজেশন ---
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;
  let obtainedMarks = 0;
  const resultDetails: any[] = [];

  // ২. ক্যালকুলেশন লুপ
  exam.questions.forEach((question: any) => {
    const qId = question._id.toString();

    // ইউজার কোন অপশনটি সিলেক্ট করেছে (0, 1, 2, 3...)
    const userAnsIndex = answers[qId];

    // 🔥 FIX: আপনার মডেল অনুযায়ী সঠিক উত্তর সরাসরি 'correctAnswer' ফিল্ডে আছে (Number)
    const correctOptIndex = question.correctAnswer;

    // ডিটেইলস অবজেক্ট তৈরি
    const detail = {
      questionId: qId,
      userSelectedOptionIndex: userAnsIndex !== undefined ? userAnsIndex : null,
      correctOptionIndex: correctOptIndex,
      isCorrect: false,
    };

    // ৩. লজিক চেক
    if (userAnsIndex === undefined || userAnsIndex === null) {
      // ⚪ Skipped (কোনো উত্তর দেয়নি)
      skippedCount++;
    } else if (userAnsIndex === correctOptIndex) {
      // 🟢 Correct Answer (ইউজারের উত্তর === সঠিক ইনডেক্স)
      correctCount++;
      obtainedMarks += question.marks || 1;
      detail.isCorrect = true;
    } else {
      // 🔴 Wrong Answer
      wrongCount++;
      detail.isCorrect = false;

      // 🔥 Negative Marking Logic (Settings থেকে)
      if (exam.settings.negativeMarking) {
        obtainedMarks -= exam.settings.negativeMarkValue;
      }
    }

    resultDetails.push(detail);
  });

  // ৪. মার্কস যেন মাইনাস না হয় (অপশনাল, চাইলে রাখতে পারেন)
  obtainedMarks = parseFloat(obtainedMarks.toFixed(2));
  if (obtainedMarks < 0) obtainedMarks = 0;

  // ৫. পাস/ফেইল চেক
  const isPassed = obtainedMarks >= exam.settings.passMarks;

  // ৬. রেজাল্ট সেভ করা
  const newResult = await Result.create({
    user: userId,
    exam: examId,
    totalMarks: exam.totalMarks,
    obtainedMarks,
    correctCount,
    wrongCount,
    skippedCount,
    isPassed,
    details: resultDetails,
  });

  return JSON.parse(JSON.stringify(newResult));
};

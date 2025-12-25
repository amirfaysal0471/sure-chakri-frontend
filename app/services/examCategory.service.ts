import ExamCategory, { IExamCategory } from "@/app/models/examCategory.model";
import connectDB from "@/lib/db";

// Create Service
export async function createExamCategory(data: Partial<IExamCategory>) {
  try {
    await connectDB();
    const newCategory = await ExamCategory.create(data);
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error: any) {
    throw new Error(error.message || "Failed to create exam category");
  }
}

// Get All Service (Sorted by Priority)
export async function getExamCategories() {
  try {
    await connectDB();
    const categories = await ExamCategory.find({})
      .sort({ priority: -1 }) // High priority shows first
      .lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    throw new Error("Failed to fetch exam categories");
  }
}

// Update Service
export async function updateExamCategory(
  id: string,
  data: Partial<IExamCategory>
) {
  try {
    await connectDB();

    // 🔥 SLUG FIX: নাম পরিবর্তন হলে স্লাগও নতুন করে জেনারেট করতে হবে
    if (data.name) {
      data.slug = data.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const updatedCategory = await ExamCategory.findByIdAndUpdate(id, data, {
      new: true, // আপডেটেড ডাটা রিটার্ন করবে
      runValidators: true, // স্কিমা ভ্যালিডেশন চেক করবে (যেমন: unique name)
    });

    if (!updatedCategory) throw new Error("Category not found");

    return JSON.parse(JSON.stringify(updatedCategory));
  } catch (error: any) {
    // ডুপ্লিকেট নাম হ্যান্ডলিং
    if (error.code === 11000) {
      throw new Error("Category name already exists!");
    }
    throw new Error(error.message || "Failed to update category");
  }
}

// Delete Service (অপরিবর্তিত)
export async function deleteExamCategory(id: string) {
  try {
    await connectDB();
    const deletedCategory = await ExamCategory.findByIdAndDelete(id);
    if (!deletedCategory) throw new Error("Category not found");
    return JSON.parse(JSON.stringify(deletedCategory));
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete category");
  }
}

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExamCategory extends Document {
  name: string;
  description?: string;
  icon: string;
  color: string;
  priority: number;
  isActive: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExamCategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Exam Category name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      default: "GraduationCap",
    },
    color: {
      type: String,
      required: true,
      default: "blue",
    },
    priority: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ FIX: 'next' প্যারামিটার বাদ দিন এবং async ফাংশন ব্যবহার করুন
ExamCategorySchema.pre("save", async function () {
  // Arrow function ব্যবহার করবেন না, কারণ 'this' দরকার
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  // next() কল করার দরকার নেই, ফাংশন শেষ হলেই কাজ হবে
});

const ExamCategory: Model<IExamCategory> =
  mongoose.models.ExamCategory ||
  mongoose.model<IExamCategory>("ExamCategory", ExamCategorySchema);

export default ExamCategory;

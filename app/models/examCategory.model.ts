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

// ✅ FIX: 'this' এর টাইপ নির্দিষ্ট করে দেওয়া হয়েছে (this: IExamCategory)
ExamCategorySchema.pre("save", async function (this: IExamCategory) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

const ExamCategory: Model<IExamCategory> =
  mongoose.models.ExamCategory ||
  mongoose.model<IExamCategory>("ExamCategory", ExamCategorySchema);

export default ExamCategory;

import connectDB from "@/lib/db";
import Contact, { IContact } from "@/app/models/contact.model";

// --- Public Services ---

// ১. নতুন মেসেজ তৈরি করা (Public User)
export const createContactMessage = async (data: Partial<IContact>) => {
  await connectDB();
  return await Contact.create(data);
};

// --- Admin Services ---

// ২. সব মেসেজ দেখা (Admin Dashboard)
export const getAllMessages = async () => {
  await connectDB();
  // নতুন মেসেজ সবার উপরে দেখাবে
  return await Contact.find().sort({ createdAt: -1 });
};

// ৩. স্ট্যাটাস বা নোট আপডেট করা (Admin Action)
export const updateMessageStatus = async (
  id: string,
  data: { status?: string; adminNote?: string }
) => {
  await connectDB();
  const updatedMessage = await Contact.findByIdAndUpdate(id, data, {
    new: true, // আপডেটেড ডাটা রিটার্ন করবে
  });

  if (!updatedMessage) {
    throw new Error("Message not found");
  }

  return updatedMessage;
};

// ৪. মেসেজ ডিলিট করা (Admin Action)
export const deleteMessage = async (id: string) => {
  await connectDB();
  const deleted = await Contact.findByIdAndDelete(id);

  if (!deleted) {
    throw new Error("Message not found");
  }

  return deleted;
};

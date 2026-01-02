import connectDB from "@/lib/db";
import PaymentMethod from "@/app/models/payment-method.model";
import Transaction from "@/app/models/transaction.model";
import User from "@/app/models/User";

// 🔥 মডেলটি অবশ্যই ইমপোর্ট করতে হবে যাতে populate কাজ করে
import "@/app/models/pricing.model";

export const getPaymentMethods = async (isAdmin: boolean = false) => {
  await connectDB();
  const query = isAdmin ? {} : { isActive: true };
  return await PaymentMethod.find(query).sort({ createdAt: -1 });
};

export const addPaymentMethod = async (data: any) => {
  await connectDB();
  return await PaymentMethod.create(data);
};

export const submitTransaction = async (userId: string, data: any) => {
  await connectDB();

  // 1. Check Duplicate TrxID
  const existing = await Transaction.findOne({ trxId: data.trxId });
  if (existing) {
    throw new Error("This Transaction ID is already used!");
  }

  // 2. Create Transaction
  const transaction = await Transaction.create({
    user: userId,
    ...data,
    status: "pending",
  });

  return transaction;
};

// ✅ FIX: এখানে ভেরিয়েবলে ডাটা নিয়ে লগ করে তারপর রিটার্ন করা হয়েছে
export const getAllTransactions = async () => {
  await connectDB();

  const transactions = await Transaction.find()
    .populate("user", "name email planExpiresAt") // User info
    .populate("plan", "title") // 🔥 Plan title for Admin Table
    .sort({ createdAt: -1 });

  return transactions;
};

export const verifyTransaction = async (
  trxId: string,
  status: "approved" | "rejected",
  adminNote?: string
) => {
  await connectDB();

  const transaction = await Transaction.findById(trxId).populate("plan");

  if (!transaction) throw new Error("Transaction not found");

  if (transaction.status === "approved") {
    throw new Error("Transaction is already approved!");
  }

  // 1. Update Transaction Status
  transaction.status = status;
  if (adminNote) transaction.adminNote = adminNote;
  await transaction.save();

  // 2. If Approved -> Update User Plan
  if (status === "approved") {
    const today = new Date();
    let addedDays = 30; // Default Monthly

    if (transaction.billingCycle?.toLowerCase() === "yearly") {
      addedDays = 365;
    }

    const expiryDate = new Date();
    expiryDate.setDate(today.getDate() + addedDays);

    // 🔥 Safety Check: plan যদি null হয় তবে 'free' সেট হবে
    const planIdToSave = transaction.plan?.planId || "free";

    await User.findByIdAndUpdate(transaction.user, {
      plan: planIdToSave,
      planExpiresAt: expiryDate,
    });
  }

  return transaction;
};

export const updatePaymentMethod = async (id: string, data: any) => {
  await connectDB();
  return await PaymentMethod.findByIdAndUpdate(id, data, { new: true });
};

export const deletePaymentMethod = async (id: string) => {
  await connectDB();
  return await PaymentMethod.findByIdAndDelete(id);
};

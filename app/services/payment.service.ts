import connectDB from "@/lib/db";
import PaymentMethod from "@/app/models/payment-method.model";
import Transaction from "@/app/models/transaction.model";
import User from "@/app/models/User";

export const getPaymentMethods = async (isAdmin: boolean = false) => {
  await connectDB();
  // এডমিন হলে সব দেখবে, ইউজার হলে শুধু Active গুলো
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
    ...data, // methodName, senderNumber, trxId, amount, plan
    status: "pending",
  });

  return transaction;
};

export const getAllTransactions = async () => {
  await connectDB();
  return await Transaction.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};

export const verifyTransaction = async (
  trxId: string,
  status: "approved" | "rejected",
  adminNote?: string
) => {
  await connectDB();

  const transaction = await Transaction.findById(trxId);
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
    const durationInMonths = transaction.durationInMonths || 1;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30 * durationInMonths);

    await User.findByIdAndUpdate(transaction.user, {
      plan: transaction.plan, // 'premium' / 'pro'
      subscriptionStatus: "active",
      subscriptionEndDate: expiryDate,
    });
  }

  return transaction;
};

export const updatePaymentMethod = async (id: string, data: any) => {
  await connectDB();
  // findByIdAndUpdate(id, data, { new: true }) - এটা আপডেটেড ডাটা রিটার্ন করে
  return await PaymentMethod.findByIdAndUpdate(id, data, { new: true });
};

// 🔥 Delete Method
export const deletePaymentMethod = async (id: string) => {
  await connectDB();
  return await PaymentMethod.findByIdAndDelete(id);
};

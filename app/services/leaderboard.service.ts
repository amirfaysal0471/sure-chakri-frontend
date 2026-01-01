import connectDB from "@/lib/db";
import Result from "@/app/models/result.model";
import User from "@/app/models/User";

// টাইমফ্রেম টাইপ
export type TimeFilter = "all" | "weekly" | "monthly";

export const getLeaderboardData = async (filter: TimeFilter = "all") => {
  await connectDB();

  // ১. তারিখ ফিল্টার সেট করা
  let dateQuery = {};
  const now = new Date();

  if (filter === "weekly") {
    const lastWeek = new Date(now.setDate(now.getDate() - 7));
    dateQuery = { createdAt: { $gte: lastWeek } };
  } else if (filter === "monthly") {
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    dateQuery = { createdAt: { $gte: lastMonth } };
  }

  // ২. MongoDB Aggregation Pipeline
  const leaderboard = await Result.aggregate([
    // A. সময় অনুযায়ী ফিল্টার করা
    { $match: dateQuery },

    // B. ইউজার অনুযায়ী গ্রুপ করা এবং পয়েন্ট যোগ করা
    {
      $group: {
        _id: "$user", // ইউজার আইডি দিয়ে গ্রুপ
        totalPoints: { $sum: "$obtainedMarks" }, // সব প্রাপ্ত নম্বর যোগ
        totalExams: { $count: {} }, // কয়টি পরীক্ষা দিয়েছে তা গণনা
        totalMarksPossible: { $sum: "$totalMarks" }, // একুরেসি বের করার জন্য মোট মার্কস
      },
    },

    // C. ইউজার কালেকশন থেকে নাম ও ছবি আনা (Join)
    {
      $lookup: {
        from: "users", // ডাটাবেসে কালেকশনের নাম (обычно lowercase plural)
        localField: "_id",
        foreignField: "_id",
        as: "userInfo",
      },
    },

    // D. অ্যারে থেকে অবজেক্ট বের করা
    { $unwind: "$userInfo" },

    // E. প্রয়োজনীয় ডাটা সাজানো এবং Accuracy ক্যালকুলেট করা
    {
      $project: {
        _id: 1,
        name: "$userInfo.name",
        image: "$userInfo.image",
        role: "$userInfo.role",
        plan: "$userInfo.plan", // প্রিমিয়াম ইউজার কিনা দেখার জন্য
        points: "$totalPoints",
        exams: "$totalExams",
        // Accuracy Formula: (Obtained / Total) * 100
        accuracy: {
          $cond: [
            { $eq: ["$totalMarksPossible", 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$totalPoints", "$totalMarksPossible"] },
                    100,
                  ],
                },
                0, // দশমিকের পর ০ ঘর
              ],
            },
          ],
        },
      },
    },

    // F. পয়েন্ট অনুযায়ী সর্ট করা (বড় থেকে ছোট)
    { $sort: { points: -1 } },

    // G. সেরা ৫০ জনকে নেওয়া
    { $limit: 50 },
  ]);

  // ৩. র‍্যাংক যুক্ত করা (1, 2, 3...)
  return leaderboard.map((user, index) => ({
    rank: index + 1,
    ...user,
  }));
};

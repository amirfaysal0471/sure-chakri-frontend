"use client";

import { useQuery } from "@tanstack/react-query";

// বেস URL এনভায়রনমেন্ট ভেরিয়েবল থেকে নেওয়া ভালো
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// গ্লোবাল ফেচ ফাংশন
const fetchData = async (endpoint: string) => {
  const res = await fetch(`${BASE_URL}${endpoint}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Network error occurred");
  }

  return res.json();
};

/**
 * @param key - ক্যাশিং এর জন্য ইউনিক কি (যেমন: ["users"], ["jobs", id])
 * @param endpoint - API এর শেষ অংশ (যেমন: "/api/users")
 * @param enabled - (অপশনাল) কন্ডিশনাল ফেচিং এর জন্য (যেমন: id থাকলেই কেবল কল হবে)
 */
export function useData<T>(
  key: any[],
  endpoint: string,
  enabled: boolean = true
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => fetchData(endpoint),
    enabled: enabled, // এটি false হলে অটোমেটিক কল হবে না
    staleTime: 1000 * 60 * 5, // ৫ মিনিট পর্যন্ত ডাটা ফ্রেশ থাকবে (ক্যাশ)
    refetchOnWindowFocus: false, // ট্যাব পরিবর্তন করলে রিফ্রেশ হবে না (দরকার হলে true দিন)
  });
}

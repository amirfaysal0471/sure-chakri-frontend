"use client";

import { useQuery } from "@tanstack/react-query";

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
 * @param key
 * @param endpoint
 * @param enabled
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

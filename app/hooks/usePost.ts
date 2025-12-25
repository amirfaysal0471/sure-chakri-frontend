"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// জেনেরিক POST ফাংশন
const postData = async ({
  endpoint,
  body,
}: {
  endpoint: string;
  body: any;
}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || "Something went wrong"
    );
  }

  return res.json();
};

/**
 * @param endpoint - যেখানে ডাটা পাঠাবেন (যেমন: "/api/categories")
 * @param invalidateKeys - (অপশনাল) সফল হলে যেই কুয়েরি রিফ্রেশ করতে চান (যেমন: ["categories"])
 * @param onSuccess - (অপশনাল) সফল হওয়ার পর যদি কিছু করতে চান
 */
export function usePost<T>(
  endpoint: string,
  options?: {
    invalidateKeys?: any[];
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: T) => postData({ endpoint, body }),

    onSuccess: (data) => {
      // ১. সফল হলে যদি কোনো লিস্ট রিফ্রেশ করতে চান
      if (options?.invalidateKeys) {
        queryClient.invalidateQueries({ queryKey: options.invalidateKeys });
      }

      // ২. কাস্টম সাকসেস ফাংশন (যেমন: টোস্ট দেখানো)
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },

    onError: (error: any) => {
      // ৩. এরর হলে যা করবেন
      if (options?.onError) {
        options.onError(error);
      }
      console.error("Mutation Error:", error.message);
    },
  });
}

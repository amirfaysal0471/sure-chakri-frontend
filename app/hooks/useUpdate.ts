"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * @param endpoint - বেস URL (যেমন: "/api/exam-categories")। ID অটোমেটিক যুক্ত হবে।
 * @param options - (অপশনাল) invalidateKeys, onSuccess, etc.
 */
export function useUpdate(
  endpoint: string,
  options?: {
    invalidateKeys?: any[];
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // URL তৈরি করা হচ্ছে: BASE_URL + endpoint + /ID
      const res = await fetch(`${BASE_URL}${endpoint}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update");
      }

      return res.json();
    },

    onSuccess: (data) => {
      // ১. কুয়েরি রিফ্রেশ (যেমন: টেবিল আপডেট হবে)
      if (options?.invalidateKeys) {
        queryClient.invalidateQueries({ queryKey: options.invalidateKeys });
      }

      // ২. কাস্টম সাকসেস ফাংশন
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },

    onError: (error: any) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
}

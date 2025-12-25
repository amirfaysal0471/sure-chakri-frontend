"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * @param endpoint - বেস URL (যেমন: "/api/exam-categories")। ID অটোমেটিক যুক্ত হবে।
 */
export function useDelete(
  endpoint: string,
  options?: {
    invalidateKeys?: any[];
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE_URL}${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete");
      }

      return res.json();
    },

    onSuccess: (data) => {
      // সফল হলে লিস্ট রিফ্রেশ করবে
      if (options?.invalidateKeys) {
        queryClient.invalidateQueries({ queryKey: options.invalidateKeys });
      }

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

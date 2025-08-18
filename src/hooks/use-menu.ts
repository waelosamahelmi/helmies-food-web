import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category, MenuItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Get the API base URL from environment variables
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default to relative URLs in development (handled by Vite proxy)
  if (import.meta.env.DEV) {
    return '';
  }
  
  // For production, you need to set VITE_API_URL environment variable
  return '';
};

const apiBaseUrl = getApiBaseUrl();

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
}

export function useMenuItems(categoryId?: number) {
  return useQuery<MenuItem[]>({
    queryKey: categoryId ? ["/api/menu-items", categoryId] : ["/api/menu-items"],
    queryFn: async () => {
      const url = categoryId ? `/api/menu-items?categoryId=${categoryId}` : "/api/menu-items";
      const fullUrl = apiBaseUrl + url;
      const response = await fetch(fullUrl, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }
      return response.json();
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<MenuItem> }) => {
      const response = await apiRequest("PATCH", `/api/menu-items/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
    },
  });
}

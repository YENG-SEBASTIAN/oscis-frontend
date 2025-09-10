import { create } from "zustand";
import { persist } from "zustand/middleware";
import ApiService from "@/lib/apiService";
import toast from "react-hot-toast";

interface AdminHomeStore {
  // Dashboard data
  totalUsers: number;
  totalOrders: number;

  // State
  loading: boolean;
  error: string | null;

  // Actions
  fetchTotalUsers: () => Promise<void>;
  fetchTotalOrders: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

export const useAdminHomeStore = create<AdminHomeStore>()(
  persist(
    (set, get) => ({
      totalUsers: 0,
      totalOrders: 0,
      loading: false,
      error: null,

      // Fetch total users
      fetchTotalUsers: async () => {
        set({ loading: true, error: null });
        try {
          const res = await ApiService.get("/accounts/users/");
          set({ totalUsers: res.count || 0 });
        } catch (error: any) {
          const message =
            error.response?.data?.detail ||
            error.message ||
            "Failed to fetch total users";
          set({ error: message });
          toast.error(message);
        } finally {
          set({ loading: false });
        }
      },

      // Fetch total orders
      fetchTotalOrders: async () => {
        set({ loading: true, error: null });
        try {
          const res = await ApiService.get("/orders/");
          set({ totalOrders: res.count || 0 });
        } catch (error: any) {
          const message =
            error.response?.data?.detail ||
            error.message ||
            "Failed to fetch total orders";
          set({ error: message });
          toast.error(message);
        } finally {
          set({ loading: false });
        }
      },

      // Refresh all dashboard data
      refreshDashboard: async () => {
        await Promise.all([get().fetchTotalUsers(), get().fetchTotalOrders()]);
      },
    }),
    {
      name: "admin-home-store",
      partialize: (state) => ({
        totalUsers: state.totalUsers,
        totalOrders: state.totalOrders,
      }),
    }
  )
);

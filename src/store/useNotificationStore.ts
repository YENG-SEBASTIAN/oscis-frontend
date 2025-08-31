"use client";

import { create } from "zustand";
import ApiService from "@/lib/apiService";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "Success" | "Error" | "Warning" | "Info";
  time: string;
  read: boolean;
};

export type ContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

interface NotificationState {
  // Notifications
  notifications: Notification[];
  count: number;
  next: string | null;
  previous: string | null;

  // Contact form
  loading: boolean;
  error: string | null;
  success: boolean;

  // Actions
  fetchNotifications: () => Promise<PaginatedResponse<Notification> | null>;
  fetchNotification: (id: string) => Promise<Notification | null>;
  createNotification: (data: Partial<Notification>) => Promise<Notification | null>;
  updateNotification: (id: string, data: Partial<Notification>) => Promise<Notification | null>;
  deleteNotification: (id: string) => Promise<boolean>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;

  // Contact message
  submitMessage: (data: Partial<ContactMessage>) => Promise<{ success: boolean; error?: string }>;

}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  count: 0,
  next: null,
  previous: null,
  loading: false,
  error: null,
  success: false,

  /** Fetch all notifications (paginated) */
  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const res = await ApiService.get<PaginatedResponse<Notification>>("/notifications/");
      set({
        notifications: res.results,
        count: res.count,
        next: res.next,
        previous: res.previous,
        loading: false,
      });
      return res;
    } catch (error: any) {
      set({ loading: false, error: error.message || "Failed to fetch notifications" });
      return null;
    }
  },

  fetchNotification: async (id: string) => {
    try {
      return await ApiService.get<Notification>(`/notifications/${id}/`);
    } catch (error) {
      console.error("Error fetching notification:", error);
      return null;
    }
  },

  createNotification: async (data: Partial<Notification>) => {
    try {
      const newNotification = await ApiService.post<Notification>("/notifications/", data);
      set({ notifications: [newNotification, ...get().notifications], count: get().count + 1 });
      return newNotification;
    } catch (error) {
      console.error("Error creating notification:", error);
      return null;
    }
  },

  updateNotification: async (id: string, data: Partial<Notification>) => {
    try {
      const updated = await ApiService.patch<Notification>(`/notifications/${id}/`, data);
      set({ notifications: get().notifications.map(n => n.id === id ? { ...n, ...updated } : n) });
      return updated;
    } catch (error) {
      console.error("Error updating notification:", error);
      return null;
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await ApiService.delete(`/notifications/${id}/`);
      set({ notifications: get().notifications.filter(n => n.id !== id), count: get().count - 1 });
      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      return false;
    }
  },

  markAsRead: async (id: string) => {
    try {
      await ApiService.post(`/notifications/${id}/mark_as_read/`, {});
      set({ notifications: get().notifications.map(n => n.id === id ? { ...n, read: true } : n) });
      return true;
    } catch (error) {
      console.error("Error marking as read:", error);
      return false;
    }
  },

  markAllAsRead: async () => {
    try {
      await ApiService.post(`/notifications/mark_all_as_read/`, {});
      set({ notifications: get().notifications.map(n => ({ ...n, read: true })) });
      return true;
    } catch (error) {
      console.error("Error marking all as read:", error);
      return false;
    }
  },

  /** Submit a contact message */
  submitMessage: async (data) => {
    set({ loading: true, error: null });

    try {
      await ApiService.post("/notifications/contact/", data);
      set({ loading: false });
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.detail || "Something went wrong";
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },


}));

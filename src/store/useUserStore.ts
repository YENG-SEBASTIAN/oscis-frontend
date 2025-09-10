import { create } from "zustand";
import ApiService from "@/lib/apiService";
import { User, UserProfile } from "@/types/user";
import { toast } from "react-hot-toast";
import { logout as clearSession } from "@/lib/auth";

type UserStore = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;

  fetchUser: () => Promise<void>;
  fetchProfile: () => Promise<void>;

  setUser: (user: User) => void;
  setProfile: (profile: UserProfile) => void;
  clearUser: () => void;

  updateUser: (data: Partial<User>) => Promise<void>;
  updateProfile: (
    data: Partial<UserProfile> & { avatar?: File | null }
  ) => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  clearUser: () => set({ user: null, profile: null }),

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const user = await ApiService.get<User>("/accounts/users/me/");
      set({ user });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || "Failed to load user data.";
      console.error(errorMsg);
      clearSession();
      set({ error: errorMsg, user: null, profile: null });
    } finally {
      set({ loading: false });
    }
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const profile = await ApiService.get<UserProfile>("/accounts/users/profile/");
      set({ profile });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || "Failed to load profile.";
      toast.error(errorMsg);
      set({ error: errorMsg, profile: null });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateUser: async (data) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await ApiService.patch<User>("/accounts/users/me/", data);
      set({ user: updatedUser });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || "Failed to update user.";
      toast.error(errorMsg);
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });

    const formData = new FormData();
    if (data.bio) formData.append("bio", data.bio);
    if (data.location) formData.append("location", data.location);
    if (data.avatar) formData.append("avatar", data.avatar);
    if (data.gender) formData.append("gender", data.gender);
    if (data.date_of_birth) formData.append("date_of_birth", data.date_of_birth);

    try {
      const updatedProfile = await ApiService.patch<UserProfile>(
        "/accounts/users/profile/",
        formData,
        true
      );
      set({ profile: updatedProfile });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || "Failed to update profile.";
      toast.error(errorMsg);
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));

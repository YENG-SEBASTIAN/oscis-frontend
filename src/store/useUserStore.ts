import { create } from 'zustand';
import ApiService from '@/lib/apiService';
import { User } from '@/types/user';
import { toast } from 'react-hot-toast';
import { logout as clearSession } from '@/lib/auth';

type UserStore = {
  user: User | null;
  loading: boolean;
  error: string | null;

  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
  clearUser: () => void;

  updateUser: (data: Partial<User>) => Promise<void>;
  updateProfile: (data: Partial<User['profile']> & { avatar?: File | null }) => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const user = await ApiService.get<User>('/accounts/users/me/');
      set({ user });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || 'Failed to load user data.';
      console.error(errorMsg);
      clearSession();
      set({ error: errorMsg, user: null });
    } finally {
      set({ loading: false });
    }
  },

  updateUser: async (data) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await ApiService.patch<User>('/accounts/users/me/', data);
      set({ user: updatedUser });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || 'Failed to update user.';
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
    if (data.bio) formData.append('bio', data.bio);
    if (data.location) formData.append('location', data.location);
    if (data.avatar) formData.append('avatar', data.avatar);

    try {
      const updatedUser = await ApiService.patch<User>('/accounts/users/profile/', formData, true);
      set({ user: updatedUser });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || 'Failed to update profile.';
      toast.error(errorMsg);
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));

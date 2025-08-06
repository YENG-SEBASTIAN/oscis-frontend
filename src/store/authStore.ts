import { create } from 'zustand';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import {
  getUser as getStoredUser,
  setUser as persistUser,
  logout as clearSession,
  setTokens,
  getAccessToken,
  getRefreshToken,
} from '@/lib/auth';
import { User } from '@/types/user';
import { AxiosError } from 'axios';

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ErrorResponse {
  detail?: string;
  email?: string;
  old_password?: string[];
  new_password?: string[];
  new_password2?: string[];
  uidb64?: string;
  token?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (
    uid: string,
    token: string,
    newPassword: string,
    confirmNewPassword: string
  ) => Promise<void>;
  setUser: (user: User) => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: getStoredUser(),
  isAuthenticated: !!getAccessToken() && !!getStoredUser(),
  loading: false,

  setUser: (user: User) => {
    persistUser(user);
    set({ user, isAuthenticated: true });
  },

  fetchUser: async () => {
    try {
      const res = await api.get('/accounts/user/');
      const user = res.data;
      persistUser(user);
      set({ user, isAuthenticated: true });
    } catch {
      clearSession();
      set({ user: null, isAuthenticated: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await api.post('/accounts/login/', { email, password });
      const { access, refresh, user } = res.data;
      setTokens(access, refresh);
      persistUser(user);
      set({ user, isAuthenticated: true });
      toast.success('Logged in successfully!');
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.detail || 'Login failed');
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  register: async ({ username, email, password, confirmPassword }) => {
    set({ loading: true });
    try {
      await api.post('/accounts/register/', {
        username,
        email,
        password,
        password2: confirmPassword,
      });
      toast.success('Registration successful. You can now log in.');
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.detail || 'Registration failed');
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      const refresh = getRefreshToken();
      if (refresh) {
        await api.post('/accounts/logout/', { refresh });
      }
    } catch {
      toast.error('Logout failed, but session was cleared');
    } finally {
      clearSession();
      set({ user: null, isAuthenticated: false });
      toast.success('Logged out successfully');
    }
  },

  changePassword: async (oldPassword, newPassword, confirmNewPassword) => {
    set({ loading: true });
    try {
      await api.post('/accounts/password/change/', {
        old_password: oldPassword,
        new_password: newPassword,
        new_password2: confirmNewPassword,
      });
      toast.success('Password changed successfully. Please log in again.');
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      const data = error.response?.data;
      const errors = [
        ...(data?.old_password || []),
        ...(data?.new_password || []),
        ...(data?.new_password2 || []),
        ...(typeof data?.detail === 'string' ? [data.detail] : []),
      ];
      toast.error(errors.length > 0 ? errors.join(' ') : 'Password change failed.');
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  requestPasswordReset: async (email) => {
    set({ loading: true });
    try {
      await api.post('/accounts/password/reset/', { email });
      toast.success('Password reset email sent! Check your inbox.');
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.email || 'Reset request failed');
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  confirmPasswordReset: async (uidb64, token, newPassword, confirmNewPassword) => {
    set({ loading: true });
    try {
      await api.post('/accounts/password/reset/confirm/', {
        uidb64,
        token,
        new_password: newPassword,
        new_password2: confirmNewPassword,
      });
      toast.success('Password has been reset successfully');
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      const data = error.response?.data;
      const errors = [
        data?.uidb64,
        data?.token,
        ...(data?.new_password || []),
        ...(data?.new_password2 || []),
      ].filter(Boolean);
      toast.error(errors.join(' ') || 'Password reset failed');
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));

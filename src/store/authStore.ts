'use client';

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

// ====================
// Types
// ====================
interface ErrorResponse {
  detail?: string;
  email?: string;
  code?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  sendLoginCode: (email: string) => Promise<void>;
  verifyLoginCode: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  fetchUser: () => Promise<void>;
}

// ====================
// Store
// ====================
export const useAuthStore = create<AuthStore>((set) => ({
  user: getStoredUser(),
  isAuthenticated: !!getAccessToken() || !!getStoredUser(),
  loading: false,

  setUser: (user: User) => {
    persistUser(user);
    set({ user, isAuthenticated: true });
  },

  fetchUser: async () => {
    try {
      const res = await api.get('/accounts/users/me/');
      const user = res.data;
      persistUser(user);
      set({ user, isAuthenticated: true });
    } catch {
      clearSession();
      set({ user: null, isAuthenticated: false });
    }
  },

  // Step 1: Request magic login code
  sendLoginCode: async (email) => {
    set({ loading: true });
    try {
      await api.post('/accounts/request-code/', { email });
      toast.success('Login code sent! Check your email.');
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.detail || 'Failed to send code');
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Step 2: Verify magic login code
  verifyLoginCode: async (email, code) => {
    set({ loading: true });
    try {
      const res = await api.post('/accounts/verify-code/', { email, code });

      const { access, refresh, user } = res.data;
      if (access && refresh) {
        setTokens(access, refresh);
      }
      if (user) {
        persistUser(user);
        set({ user, isAuthenticated: true });
      }

      toast.success('Logged in successfully!');
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.code || 'Login failed');
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
}));

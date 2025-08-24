import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken, logout } from './auth';
import { getGuestId } from './guest';

import { toast } from 'react-hot-toast';

if (!process.env.NEXT_PUBLIC_MEDIA_API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_MEDIA_API_BASE_URL is not set in .env");
}

export const MediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_API_BASE_URL;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();
    const guestId = await getGuestId();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (guestId && config.headers) {
      config.headers['X-Guest-ID'] = guestId;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const refreshToken = getRefreshToken();

    const isTokenExpired = error.response?.status === 401 && !originalRequest?._retry;

    if (isTokenExpired && refreshToken) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/token/refresh/`,
          { refresh: refreshToken }
        );

        setAccessToken(data.access);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
        }

        return api(originalRequest);
      } catch (refreshError: any) {
        logout();
        toast.error('Session expired. Please log in again.');
        return Promise.reject(refreshError);
      }
    }

    // Handle any other unexpected error
    if (error.response?.status === 403) {
      toast.error('You do not have permission for this action.');
    } else if (error.response?.status === 500) {
      toast.error('Something went wrong. Try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;

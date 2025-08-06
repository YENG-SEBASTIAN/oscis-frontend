import Cookies from 'js-cookie';
import { User } from '@/types/user';

// Keys for cookie storage
const ACCESS_KEY = 'access';
const REFRESH_KEY = 'refresh';
const USER_KEY = 'user';
const AUTH_KEY = 'isAuthenticated';


export const getAccessToken = (): string | undefined => Cookies.get(ACCESS_KEY);

export const getRefreshToken = (): string | undefined => Cookies.get(REFRESH_KEY);

export const getUser = (): User | null => {
  const user = Cookies.get(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => Cookies.get(AUTH_KEY) === 'true';


export const setTokens = (access: string, refresh: string): void => {
  Cookies.set(ACCESS_KEY, access, { secure: true });
  Cookies.set(REFRESH_KEY, refresh, { secure: true });
  Cookies.set(AUTH_KEY, 'true', { secure: true });
};

export const setAccessToken = (access: string): void => {
  Cookies.set(ACCESS_KEY, access, { secure: true });
  Cookies.set(AUTH_KEY, 'true', { secure: true });
};

export const setUser = (user: User): void => {
  Cookies.set(USER_KEY, JSON.stringify(user), { secure: true });
  Cookies.set(AUTH_KEY, 'true', { secure: true });
};

export const removeUser = (): void => {
  Cookies.remove(USER_KEY);
  Cookies.remove(AUTH_KEY);
};

export const logout = (): void => {
  Cookies.remove(ACCESS_KEY);
  Cookies.remove(REFRESH_KEY);
  Cookies.remove(USER_KEY);
  Cookies.remove(AUTH_KEY);
};

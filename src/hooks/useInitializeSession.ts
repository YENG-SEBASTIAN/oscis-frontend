'use client';

import { useEffect } from 'react';
import ApiService from '@/lib/apiService';

export const SessionInitializer = () => {
  useEffect(() => {
    const initSession = async () => {
      try {
        const data = await ApiService.post('/accounts/initialize-session/', {});
        console.log('Session initialized:', data.session_key);
      } catch (err) {
        console.error('Failed to initialize session:', err);
      }
    };

    initSession();
  }, []);

  return null;
};

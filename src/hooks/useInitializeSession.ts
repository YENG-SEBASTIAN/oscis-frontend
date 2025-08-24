'use client';

import { useEffect } from 'react';
import ApiService from '@/lib/apiService';

export const SessionInitializer = () => {
  useEffect(() => {
    // Prevent re-initialization
    if (sessionStorage.getItem("session-initialized")) return;

    const initSession = async () => {
      try {
        const res = await ApiService.post('/accounts/initialize-session/', {});
        console.log('Session initialized:', res.data.session_key);

        // Mark session initialized so it doesn’t run again
        sessionStorage.setItem("session-initialized", "true");
      } catch (err) {
        console.error('Failed to initialize session:', err);
      }
    };

    initSession();
  }, []);

  return null;
};

'use client';

import { useEffect } from 'react';
import ApiService from '@/lib/apiService';
const GUEST_KEY = "oscis_guest_id";
export const GuestInitializer = () => {
  useEffect(() => {
    const initGuest = async () => {
      try {
        const existingGuestId = localStorage.getItem(GUEST_KEY);

        if (existingGuestId) {
          console.log("Guest already exists:", existingGuestId);
          return;
        }

        // If no guest id, create one
        const res = await ApiService.post('/accounts/initialize-guest/', {});
        const guestId = res.guest_id;

        localStorage.setItem(GUEST_KEY, guestId);
      } catch (err) {
        console.error("Failed to initialize guest:", err);
      }
    };

    initGuest();
  }, []);

  return null;
};

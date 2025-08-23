'use client';

import { useEffect } from 'react';
import ApiService from '@/lib/apiService';

export const SessionInitializer = () => {
    useEffect(() => {
        const initSession = async () => {
            try {
                const data = await ApiService.get('/accounts/initialize-session/');
                console.log('Session initialized:', data.session_key);

                console.log('Cookies after first call:', document.cookie);

                // Second call - should use same session
                console.log('=== SECOND CALL ===');
                const data2 = await ApiService.get('/accounts/initialize-session/');
                console.log('Session 2:', data2.session_key);

                // Third call - check cart
                console.log('=== CART CALL ===');
                const cartData = await ApiService.get('/cart/');
                console.log('Cart session:', cartData.debug_info);

            } catch (err) {
                console.error('Failed to initialize session:', err);
            }
        };

        initSession();
    }, []);

    return null;
};

'use client';

import { create } from 'zustand';
import ApiService from '@/lib/apiService';

// ====================
// Types
// ====================
export interface PaymentItem {
  id: string;
  order_number: string;
  payment_intent_id: string | null;
  amount: number;
  status: string;
  created_at: string;
  order_status?: string;
  payment_status?: string;
}

// ====================
// Payment Store
// ====================
interface PaymentStore {
  payments: PaymentItem[];
  selectedPayment: PaymentItem | null;
  loading: boolean;
  error: string | null;

  fetchPayments: () => Promise<void>;
  fetchPayment: (id: string) => Promise<void>;
  verifyPaymentByOrderId: (orderNumber: string) => Promise<PaymentItem>;
  retryStripePayment: (orderNumber: string) => Promise<{ client_secret: string }>;
  clearSelected: () => void;
}

export const usePaymentStore = create<PaymentStore>((set) => {
  const extractError = (err: any, fallback: string) =>
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    fallback;

  return {
    payments: [],
    selectedPayment: null,
    loading: false,
    error: null,

    // --------------------
    // Fetch all payments
    // --------------------
    fetchPayments: async () => {
      set({ loading: true, error: null });
      try {
        const data = await ApiService.get<PaymentItem[]>('/payments/');
        set({ payments: data, loading: false });
      } catch (err) {
        set({ error: extractError(err, 'Failed to fetch payments'), loading: false });
      }
    },

    // --------------------
    // Fetch a single payment by ID
    // --------------------
    fetchPayment: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const data = await ApiService.get<PaymentItem>(`/payments/${id}/`);
        set({ selectedPayment: data, loading: false });
      } catch (err) {
        set({ error: extractError(err, 'Failed to fetch payment'), loading: false });
      }
    },

    // --------------------
    // Verify payment status by order number
    // --------------------
    verifyPaymentByOrderId: async (orderNumber: string) => {
      set({ loading: true, error: null });

      try {
        // Use the orderNumber directly in the URL
        const data = await ApiService.get<PaymentItem>(`/payments/verify/${orderNumber}/`);

        set({ selectedPayment: data, loading: false });
        return data;
      } catch (err: any) {
        const errorMessage = extractError(err, 'Failed to verify payment');
        set({ error: errorMessage, loading: false });
        throw err;
      }
    },


    // --------------------
    // Retry Stripe payment for failed orders
    // --------------------
    retryStripePayment: async (orderId: string) => {
      set({ loading: true, error: null });

      try {
        const data = await ApiService.post<{ client_secret: string }>(
          `/payments/retry-stripe-payment/${orderId}/`,
          {} // backend already gets order_id from path, no need to send body
        );

        set({ loading: false });
        return data;
      } catch (err) {
        set({
          error: extractError(err, 'Retry payment failed'),
          loading: false,
        });
        throw err;
      }
    },


    // --------------------
    // Clear selected payment
    // --------------------
    clearSelected: () => set({ selectedPayment: null, error: null }),
  };
});

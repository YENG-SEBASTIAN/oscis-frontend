'use client';

import { create } from 'zustand';
import ApiService from '@/lib/apiService';

export interface PaymentItem {
  id: string;
  order_number: string;
  payment_intent_id: string;
  status: string;
  amount: number;
  order_status: string;
  payment_status: string;
  created_at: string;
}

interface PaymentStore {
  payments: PaymentItem[];
  selectedPayment: PaymentItem | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchPayments: () => Promise<void>;
  fetchPayment: (id: string) => Promise<void>;
  verifyPayment: (orderNumber: string) => Promise<PaymentItem>;
  clearSelected: () => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  payments: [],
  selectedPayment: null,
  loading: false,
  error: null,

  fetchPayments: async () => {
    set({ loading: true, error: null });
    try {
      const data = await ApiService.get<PaymentItem[]>('/payments/');
      set({ payments: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch payments', loading: false });
    }
  },

  fetchPayment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await ApiService.get<PaymentItem>(`/payments/${id}/`);
      set({ selectedPayment: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch payment', loading: false });
    }
  },

  verifyPayment: async (orderNumber: string) => {
    set({ loading: true, error: null });
    try {
      const data = await ApiService.get<PaymentItem>(`/payments/orders/verify-payment/?order=${orderNumber}`);
      set({ selectedPayment: data, loading: false });
      return data;
    } catch (err: any) {
      set({ error: err.message || 'Failed to verify payment', loading: false });
      throw err;
    }
  },

  clearSelected: () => set({ selectedPayment: null, error: null }),
}));

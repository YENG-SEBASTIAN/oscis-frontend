'use client';

import { create } from 'zustand';
import ApiService from '@/lib/apiService';

// ====================
// Types
// ====================
export interface OrderItem {
  id: string;
  product: string;
  product_name: string;
  quantity: number;
  price: string;
  total_price: string;
}

export interface Payment {
  id: string;
  provider: string;
  payment_intent_id: string | null;
  amount: number;
  status: string;
  transaction_id: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  user: string | null;
  address: string;
  total_price: string; // backend returns string
  order_status: string;
  payment_status: string;
  payment_method?: string;
  items: OrderItem[];
  payment: Payment;
  client_secret?: string;
  payment_intent_id?: string;
  created_at: string;
}

export interface PaginatedOrders {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

export interface CheckoutPayload {
  address: string;
  payment_method: 'COD' | 'CARD';
}

// ====================
// Order Store
// ====================
interface OrderState {
  orders: Order[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;

  fetchOrders: (params?: Record<string, any>) => Promise<Order[] | null>;
  fetchOrderById: (id: string) => Promise<Order | null>;
  checkout: (payload: CheckoutPayload) => Promise<Order>;
}

export const useOrderStore = create<OrderState>((set, get) => {
  const extractError = (err: any, fallback: string) =>
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    fallback;

  return {
    orders: [],
    count: 0,
    next: null,
    previous: null,
    loading: false,
    error: null,

    // --------------------
    // Fetch all orders
    // --------------------
    fetchOrders: async (params) => {
      set({ loading: true, error: null });
      try {
        const data = await ApiService.get<PaginatedOrders>('/orders/', { params });
        set({
          orders: data.results,
          count: data.count,
          next: data.next,
          previous: data.previous,
          loading: false,
        });
        return data.results;
      } catch (err) {
        set({ error: extractError(err, 'Failed to fetch orders'), loading: false });
        return null;
      }
    },

    // --------------------
    // Fetch a single order by ID
    // --------------------
    fetchOrderById: async (id) => {
      set({ loading: true, error: null });
      try {
        const order = await ApiService.get<Order>(`/orders/${id}/`);
        set({ loading: false });
        return order;
      } catch (err) {
        set({ error: extractError(err, 'Failed to fetch order'), loading: false });
        return null;
      }
    },

    // --------------------
    // Checkout (create a new order)
    // --------------------
    checkout: async (payload) => {
      set({ loading: true, error: null });
      try {
        const newOrder = await ApiService.post<Order>('/orders/checkout/', payload);
        set((state) => ({
          orders: [newOrder, ...state.orders],
          count: state.count + 1,
          loading: false,
        }));
        return newOrder;
      } catch (err) {
        set({ error: extractError(err, 'Checkout failed'), loading: false });
        throw err;
      }
    },


  };
});

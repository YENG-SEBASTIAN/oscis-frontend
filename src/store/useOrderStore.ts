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
  price: string;        // e.g. "179.00"
  total_price: string;  // e.g. "179.00"
}

export interface Payment {
  id: string;
  provider: string;
  payment_intent_id: string | null;
  amount: number;
  status: string;
  transaction_id: string;
}

export interface StripeIntent {
  id: string;
  status: string;
  client_secret: string;
  amount?: number;
  currency?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user: string | null;
  address: string;
  total_price: number;
  order_status: string;
  payment_status: string;
  items: OrderItem[];
  payment: Payment;
  payment_intent_id?: string;
  client_secret?: string;
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
  payment_provider?: string; // defaults to Stripe
}

// ====================
// Store
// ====================
interface OrderState {
  orders: Order[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;

  fetchOrders: (params?: Record<string, any>) => Promise<void>;
  fetchOrderById: (id: string) => Promise<Order | null>;
  fetchOrderItems: (orderId: string) => Promise<OrderItem[] | null>;
  fetchOrderItemById: (orderId: string, itemId: string) => Promise<OrderItem | null>;
  checkout: (payload: CheckoutPayload) => Promise<Order | null>;
}

export const useOrderStore = create<OrderState>((set) => {
  // Helper for handling errors
  const handleError = (err: any, fallback: string) => {
    console.error(fallback, err);
    return err?.response?.data?.error ||
      err?.response?.data?.message ||
      JSON.stringify(err?.response?.data) ||
      err?.message ||
      fallback;
  };

  return {
    orders: [],
    count: 0,
    next: null,
    previous: null,
    loading: false,
    error: null,

    // Fetch all orders
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
      } catch (err: any) {
        set({
          error: handleError(err, 'Failed to fetch orders'),
          loading: false,
        });
      }
    },

    // Fetch order by ID
    fetchOrderById: async (id) => {
      set({ loading: true, error: null });
      try {
        const order = await ApiService.get<Order>(`/orders/${id}/`);
        set({ loading: false });
        return order;
      } catch (err: any) {
        set({
          error: handleError(err, 'Failed to fetch order'),
          loading: false,
        });
        return null;
      }
    },

    // Fetch items of a specific order
    fetchOrderItems: async (orderId) => {
      set({ loading: true, error: null });
      try {
        const order = await ApiService.get<Order>(`/orders/${orderId}/`);
        set({ loading: false });
        return order.items;
      } catch (err: any) {
        set({
          error: handleError(err, 'Failed to fetch order items'),
          loading: false,
        });
        return null;
      }
    },

    // Fetch a specific item by ID
    fetchOrderItemById: async (orderId, itemId) => {
      set({ loading: true, error: null });
      try {
        const order = await ApiService.get<Order>(`/orders/${orderId}/`);
        const item = order.items.find((i) => i.id === itemId) || null;
        set({ loading: false });
        return item;
      } catch (err: any) {
        set({
          error: handleError(err, 'Failed to fetch order item'),
          loading: false,
        });
        return null;
      }
    },

    // Checkout (place new order)
    checkout: async (payload) => {
      set({ loading: true, error: null });

      try {
        console.log("🚀 Checkout payload:", payload);

        const res = await ApiService.post<Order>("/orders/checkout/", payload);
        const newOrder = res;

        console.log("✅ Checkout response:", newOrder);
        console.log("📋 Order ID:", newOrder.id);
        console.log("📋 Order Number:", newOrder.order_number);

        // Update local store
        set((state) => ({
          orders: [newOrder, ...state.orders],
          count: state.count + 1,
          loading: false,
        }));

        return newOrder;
      } catch (err: any) {
        set({
          error: handleError(err, "Checkout failed"),
          loading: false,
        });
        return null;
      }
    }

  };
});

'use client';

import { create } from 'zustand';
import ApiService from '@/lib/apiService';
import { ProductInterface } from '@/types/types';
import { CustomerDetails } from '@/components/checkout/PaymentForm';
// ====================
// Types (unchanged except small additions)
// ====================
export interface OrderItem {
  id: string;
  product: ProductInterface;
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
  total_price: string;
  order_status: string;
  payment_status: string;
  payment_method?: string;
  items: OrderItem[];
  payment: Payment;
  customer_details: CustomerDetails;
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
  payment_method:  "CARD" | "CLEARPAY" | "APPLE_PAY" | "GOOGLE_PAY" | "KLARNA";
  guest_session_key: string;
}

// ====================
// Store interface
// ====================
interface OrderState {
  orders: Order[];
  ordersById: Record<string, Order>;
  count: number;
  next: string | null;
  previous: string | null;

  // flags
  loadingOrders: boolean;
  loadingOrder: boolean;
  checkoutLoading: boolean;
  error: string | null;

  // actions
  fetchOrders: (params?: Record<string, any>, append?: boolean) => Promise<Order[] | null>;
  fetchOrderById: (id: string, force?: boolean) => Promise<Order | null>;
  checkout: (payload: CheckoutPayload) => Promise<Order>;
  updateOrderInStore: (order: Order) => void;
  clearOrders: () => void;
}

// ====================
// Implementation
// ====================
export const useOrderStore = create<OrderState>((set, get) => {
  let fetchCounter = 0;

  const extractError = (err: any, fallback = 'Something went wrong') => {
    if (!err) return fallback;
    return (
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      (typeof err === 'string' ? err : fallback)
    );
  };

  return {
    orders: [],
    ordersById: {},
    count: 0,
    next: null,
    previous: null,

    loadingOrders: false,
    loadingOrder: false,
    checkoutLoading: false,
    error: null,

    // --------------------
    // Fetch all orders (supports append for pagination)
    // --------------------
    fetchOrders: async (params = {}, append = false) => {
      const thisFetch = ++fetchCounter;
      set({ loadingOrders: true, error: null });
      try {
        const data = await ApiService.get<PaginatedOrders>('/orders/', { params });

        if (thisFetch !== fetchCounter) return null;

        set((state) => ({
          orders: append ? [...state.orders, ...data.results] : data.results,
          ordersById: data.results.reduce((m, o) => ({ ...m, [o.id]: o }), append ? { ...state.ordersById } : {}),
          count: data.count,
          next: data.next,
          previous: data.previous,
          loadingOrders: false,
        }));
        return data.results;
      } catch (err) {
        set({ error: extractError(err, 'Failed to fetch orders'), loadingOrders: false });
        return null;
      }
    },

    // --------------------
    // Fetch a single order by ID (cached)
    // --------------------
    fetchOrderById: async (id, force = false) => {
      const cached = get().ordersById[id];
      if (cached && !force) return cached;

      set({ loadingOrder: true, error: null });
      try {
        const order = await ApiService.get<Order>(`/orders/${id}/`);
        set((state) => ({
          loadingOrder: false,
          ordersById: { ...state.ordersById, [order.id]: order },
          // optionally keep orders array in sync if you want:
          orders: state.orders.some((o) => o.id === order.id) ? state.orders.map((o) => (o.id === order.id ? order : o)) : [order, ...state.orders],
        }));
        return order;
      } catch (err) {
        set({ error: extractError(err, 'Failed to fetch order'), loadingOrder: false });
        return null;
      }
    },

    // --------------------
    // Checkout (create a new order)
    // --------------------
    checkout: async (payload) => {
      set({ checkoutLoading: true, error: null });
      try {
        // Ensure guest_session_key is always added if available
        let guestId: string | null = null;
        if (typeof window !== "undefined") {
          guestId = localStorage.getItem("oscis_guest_id");
        }

        const requestBody: CheckoutPayload = {
          ...payload,
          guest_session_key: guestId || payload.guest_session_key,
        };

        const newOrder = await ApiService.post<Order>('/orders/checkout/', requestBody);
        set((state) => ({
          orders: [newOrder, ...state.orders],
          ordersById: { ...state.ordersById, [newOrder.id]: newOrder },
          count: state.count + 1,
          checkoutLoading: false,
        }));

        return newOrder;
      } catch (err) {
        const message = extractError(err, 'Checkout failed');
        set({ error: message, checkoutLoading: false });
        // rethrow a normalized error so UI can catch it if needed
        throw new Error(message);
      }
    },

    // --------------------
    // Helpers
    // --------------------
    updateOrderInStore: (order) => {
      set((state) => ({
        orders: state.orders.map((o) => (o.id === order.id ? order : o)),
        ordersById: { ...state.ordersById, [order.id]: order },
      }));
    },

    clearOrders: () => {
      set({
        orders: [],
        ordersById: {},
        count: 0,
        next: null,
        previous: null,
        error: null,
      });
    },
  };
});

'use client';

import { create } from 'zustand';
import ApiService from '@/lib/apiService';
import { CustomerDetails } from '@/components/checkout/PaymentForm';

// ====================
// Types (aligned to your API)
// ====================

export interface OrderItem {
  id: string | number;
  product: string; // UUID
  product_name: string;
  product_image: string | null; // absolute or relative URL
  quantity: number;
  price: number;           // <- number in API
  total_price: string;     // API sends "69.00" as string for line totals
}

export interface Payment {
  id: string;
  provider: string;                  // "card" | "CARD" | ...
  payment_intent_id: string | null;
  amount: number;
  status: string;                    // "Success" | ...
  transaction_id: string | null;
  order_status?: string;
  order_id?: string;
  order_number?: string;
}

export interface Address {
  id: string;
  user: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address_line: string;
  house_number: string | null;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  additional_instructions: string;
  full_address: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Paid & Confirmed'
  | 'Confirmed' 
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  order_number: string;
  user: string | null;
  address: Address;
  total_price: number;
  order_status: OrderStatus;
  payment_status: string;
  payment_method?: "card" | "clearpay" | "klarna" | "google_pay";
  items: OrderItem[];
  payment: Payment;
  customer_details?: CustomerDetails;
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
  payment_method?: "card" | "clearpay" | "klarna";
}

// ====================
// Store Interface
// ====================
interface OrderState {
  orders: Order[];
  ordersById: Record<string, Order>;
  count: number;
  next: string | null;
  previous: string | null;

  loadingOrders: boolean;
  loadingOrder: boolean;
  checkoutLoading: boolean;
  error: string | null;

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

    // Fetch list
    fetchOrders: async (params = {}, append = false) => {
      const thisFetch = ++fetchCounter;
      set({ loadingOrders: true, error: null });

      try {
        const data = await ApiService.get<PaginatedOrders>('/orders/', { params });

        if (thisFetch !== fetchCounter) return null; // stale

        set((state) => {
          const mergedById = append ? { ...state.ordersById } : {};
          for (const o of data.results) mergedById[o.id] = o;

          return {
            orders: append ? [...state.orders, ...data.results] : data.results,
            ordersById: mergedById,
            count: data.count,
            next: data.next,
            previous: data.previous,
            loadingOrders: false,
          };
        });

        return data.results;
      } catch (err) {
        set({ error: extractError(err, 'Failed to fetch orders'), loadingOrders: false });
        return null;
      }
    },

    // Fetch single (cached)
    fetchOrderById: async (id, force = false) => {
      const cached = get().ordersById[id];
      if (cached && !force) return cached;

      set({ loadingOrder: true, error: null });
      try {
        const order = await ApiService.get<Order>(`/orders/${id}/`);

        set((state) => ({
          loadingOrder: false,
          ordersById: { ...state.ordersById, [order.id]: order },
          orders: state.orders.some((o) => o.id === order.id)
            ? state.orders.map((o) => (o.id === order.id ? order : o))
            : [order, ...state.orders],
        }));

        return order;
      } catch (err) {
        set({ error: extractError(err, 'Failed to fetch order'), loadingOrder: false });
        return null;
      }
    },

    // Checkout
    checkout: async (payload) => {
      set({ checkoutLoading: true, error: null });
      try {

        const requestBody: CheckoutPayload = {
          ...payload
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
        throw new Error(message);
      }
    },

    // Helpers
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

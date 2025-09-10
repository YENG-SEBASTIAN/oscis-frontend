"use client";

import { create } from "zustand";
import ApiService from "@/lib/apiService";
import { CustomerDetails } from "@/components/checkout/PaymentForm";

// ====================
// Types
// ====================
export interface OrderItem {
  id: string | number;
  product: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  total_price: string;
}

export interface Payment {
  id: string;
  provider: string;
  payment_intent_id: string | null;
  amount: number;
  status: string;
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
  | "Pending"
  | "Paid & Confirmed"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  order_number: string;
  user: string | null;
  address: Address;
  total_price: number;
  order_status: OrderStatus;
  payment_status: string;
  payment_method?: "card" | "afterpay_clearpay" | "klarna";
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
  payment_method?: "card" | "afterpay_clearpay" | "klarna";
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

  selectedOrder: Order | null;
  filters: Record<string, any>;

  loadingOrders: boolean;
  loadingOrder: boolean;
  checkoutLoading: boolean;
  updatingOrder: boolean;
  error: string | null;

  fetchOrders: (params?: Record<string, any>, append?: boolean) => Promise<Order[] | null>;
  fetchOrderById: (id: string, force?: boolean) => Promise<Order | null>;
  checkout: (payload: CheckoutPayload) => Promise<Order>;
  updateOrder: (id: string, payload: Partial<Order>) => Promise<Order | null>;

  setFilters: (filters: Record<string, any>, refetch?: boolean) => void;
  clearFilters: () => void;

  updateOrderInStore: (order: Order) => void;
  setSelectedOrder: (order: Order | null) => void;
  clearOrders: () => void;
}

// ====================
// Implementation
// ====================
export const useOrderStore = create<OrderState>((set, get) => {
  let fetchCounter = 0;

  const extractError = (err: any, fallback = "Something went wrong") => {
    if (!err) return fallback;
    return (
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      (typeof err === "string" ? err : fallback)
    );
  };

  return {
    orders: [],
    ordersById: {},
    count: 0,
    next: null,
    previous: null,
    selectedOrder: null,
    filters: {},

    loadingOrders: false,
    loadingOrder: false,
    checkoutLoading: false,
    updatingOrder: false,
    error: null,

    // Fetch paginated orders (with filters)
    fetchOrders: async (params = {}, append = false) => {
      const thisFetch = ++fetchCounter;
      set({ loadingOrders: true, error: null });

      const mergedParams = { ...get().filters, ...params };

      try {
        const data = await ApiService.get<PaginatedOrders>("/orders/", { params: mergedParams });

        if (thisFetch !== fetchCounter) return null; // prevent stale overwrites

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
        set({ error: extractError(err, "Failed to fetch orders"), loadingOrders: false });
        return null;
      }
    },

    // Fetch a single order (cached unless forced)
    fetchOrderById: async (id, force = false) => {
      const cached = get().ordersById[id];
      if (cached && !force) {
        set({ selectedOrder: cached });
        return cached;
      }

      set({ loadingOrder: true, error: null });
      try {
        const order = await ApiService.get<Order>(`/orders/${id}/`);

        set((state) => ({
          loadingOrder: false,
          ordersById: { ...state.ordersById, [order.id]: order },
          orders: state.orders.some((o) => o.id === order.id)
            ? state.orders.map((o) => (o.id === order.id ? order : o))
            : [order, ...state.orders],
          selectedOrder: order,
        }));

        return order;
      } catch (err) {
        set({ error: extractError(err, "Failed to fetch order"), loadingOrder: false });
        return null;
      }
    },

    // Checkout (create order)
    checkout: async (payload) => {
      set({ checkoutLoading: true, error: null });
      try {
        const newOrder = await ApiService.post<Order>("/orders/checkout/", payload);

        set((state) => ({
          orders: [newOrder, ...state.orders],
          ordersById: { ...state.ordersById, [newOrder.id]: newOrder },
          count: state.count + 1,
          checkoutLoading: false,
        }));

        return newOrder;
      } catch (err) {
        const message = extractError(err, "Checkout failed");
        set({ error: message, checkoutLoading: false });
        throw new Error(message);
      }
    },

    // Update an order
    updateOrder: async (id, payload) => {
      set({ updatingOrder: true, error: null });
      try {
        const updatedOrder = await ApiService.patch<Order>(`/orders/${id}/update/`, payload);

        set((state) => ({
          updatingOrder: false,
          orders: state.orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
          ordersById: { ...state.ordersById, [updatedOrder.id]: updatedOrder },
          selectedOrder: state.selectedOrder?.id === updatedOrder.id ? updatedOrder : state.selectedOrder,
        }));

        return updatedOrder;
      } catch (err) {
        const message = extractError(err, "Failed to update order");
        set({ error: message, updatingOrder: false });
        return null;
      }
    },

    // Manage filters
    setFilters: (filters, refetch = true) => {
      set({ filters });
      if (refetch) {
        get().fetchOrders(filters);
      }
    },

    clearFilters: () => {
      set({ filters: {} });
      get().fetchOrders({});
    },

    // Local store updates
    updateOrderInStore: (order) => {
      set((state) => ({
        orders: state.orders.map((o) => (o.id === order.id ? order : o)),
        ordersById: { ...state.ordersById, [order.id]: order },
        selectedOrder: state.selectedOrder?.id === order.id ? order : state.selectedOrder,
      }));
    },

    setSelectedOrder: (order) => {
      set({ selectedOrder: order });
    },

    clearOrders: () => {
      set({
        orders: [],
        ordersById: {},
        count: 0,
        next: null,
        previous: null,
        selectedOrder: null,
        filters: {},
        error: null,
      });
    },
  };
});

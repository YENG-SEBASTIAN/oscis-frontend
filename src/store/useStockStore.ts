import { create } from "zustand";
import { persist } from "zustand/middleware";
import ApiService from "@/lib/apiService";
import toast from "react-hot-toast";

/** -------------------------------
 *  Types
 *  ------------------------------- */
export type TransactionType =
  | "purchase"
  | "sale"
  | "return_in"
  | "return_out"
  | "adjustment"
  | "restock";

export type AdjustmentType = "add" | "subtract";

/** Raw Stock Transaction (for detailed view) */
export interface StockTransaction {
  id: number;
  product: string;
  product_name: string;
  transaction_type: TransactionType;
  quantity: number;
  quantity_after_transaction: number;
  unit_cost: number;
  total_value: number;
  reference?: string;
  notes?: string;
  adjustment_type?: AdjustmentType;
  minimum_stock_level?: number;
  running_balance: number;
  created_at: string;
}

/** Stock Summary (latest snapshot per product) */
export interface StockSummary {
  product: string;
  product_name: string;
  running_balance: number;
  current_stock: number;
  minimum_stock_level: number;
  stock_status: "In Stock" | "Low Stock" | "Out of Stock";
  last_transaction_type: TransactionType;
  created_at: string;
}

interface StockFilters {
  transaction_type?: TransactionType;
  adjustment_type?: AdjustmentType;
  product_id?: string;
}

/** -------------------------------
 *  Zustand Store
 *  ------------------------------- */
interface StockStore {
  // Data
  stocks: StockTransaction[];
  stockSummary: StockSummary[];

  // Pagination
  count: number;
  next: string | null;
  previous: string | null;

  // State
  loading: boolean;
  error: string | null;
  filters: StockFilters;

  // Actions
  setFilters: (filters: StockFilters) => void;
  resetFilters: () => void;

  fetchStocks: (params?: Record<string, any>) => Promise<void>;
  fetchSummary: (params?: Record<string, any>) => Promise<void>;

  adjustStock: (payload: {
    product_id: string;
    quantity: number;
    unit_cost?: number;
    notes?: string;
    adjustment_type?: AdjustmentType;
  }) => Promise<void>;

  addStock: (payload: {
    product_id: string;
    quantity: number;
    unit_cost?: number;
    notes?: string;
  }) => Promise<void>;

  restockStock: (payload: {
    product_id: string;
    quantity: number;
    unit_cost?: number;
    notes?: string;
  }) => Promise<void>;
}

export const useStockStore = create<StockStore>()(
  persist(
    (set, get) => ({
      /** -------------------------------
       *  Initial State
       *  ------------------------------- */
      stocks: [],
      stockSummary: [],
      count: 0,
      next: null,
      previous: null,
      loading: false,
      error: null,
      filters: {},

      /** -------------------------------
       *  Filters
       *  ------------------------------- */
      setFilters: (filters) => set({ filters }),
      resetFilters: () => set({ filters: {} }),

      /** -------------------------------
       *  Fetch Transactions
       *  ------------------------------- */
      fetchStocks: async (params) => {
        set({ loading: true, error: null });
        try {
          const filters = { ...get().filters, ...params };
          const res = await ApiService.get("/stocks/", filters);

          set({
            stocks: res.results || [],
            count: res.count,
            next: res.next,
            previous: res.previous,
            filters,
          });
        } catch (error: any) {
          const message =
            error.response?.data?.detail ||
            error.message ||
            "Failed to fetch stock transactions";
          set({ error: message });
          toast.error(message);
        } finally {
          set({ loading: false });
        }
      },

      /** -------------------------------
       *  Fetch Summary
       *  ------------------------------- */
      fetchSummary: async (params) => {
        set({ loading: true, error: null });
        try {
          const filters = { ...get().filters, ...params };
          const res = await ApiService.get("/stocks/summary/", filters);

          set({
            stockSummary: res.results || [],
            count: res.count,
            next: res.next,
            previous: res.previous,
            filters,
          });
        } catch (error: any) {
          const message =
            error.response?.data?.detail ||
            error.message ||
            "Failed to fetch stock summary";
          set({ error: message });
          toast.error(message);
        } finally {
          set({ loading: false });
        }
      },

      /** -------------------------------
       *  Adjust Stock
       *  ------------------------------- */
      adjustStock: async (payload) => {
        set({ loading: true, error: null });
        try {
          const res = await ApiService.post("/stocks/adjust/", payload);
          set((state) => ({
            stocks: [res, ...state.stocks],
          }));
          toast.success("Stock adjusted successfully");
        } catch (error: any) {
          const message =
            error.response?.data?.detail ||
            error.message ||
            "Failed to adjust stock";
          set({ error: message });
          toast.error(message);
        } finally {
          set({ loading: false });
        }
      },

      /** -------------------------------
       *  Add Stock (New stock entry)
       *  ------------------------------- */
      addStock: async (payload) => {
        set({ loading: true, error: null });
        try {
          const res = await ApiService.post("/stocks/restock/", payload);
          set((state) => ({
            stocks: [res, ...state.stocks],
          }));
          toast.success("Stock added successfully");
        } catch (error: any) {
          const message =
            error.response?.data?.detail ||
            error.message ||
            "Failed to add stock";
          set({ error: message });
          toast.error(message);
        } finally {
          set({ loading: false });
        }
      },

      /** -------------------------------
       *  Restock Stock (Increase quantity of existing stock)
       *  ------------------------------- */
      restockStock: async (payload) => {
        set({ loading: true, error: null });
        try {
          const res = await ApiService.post("/stocks/restock/", payload);
          set((state) => ({
            stocks: [res, ...state.stocks],
          }));
          toast.success("Stock restocked successfully");
        } catch (error: any) {
          const message =
            error.response?.data?.detail ||
            error.message ||
            "Failed to restock";
          set({ error: message });
          toast.error(message);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "stock-store",
      partialize: (state) => ({
        stocks: state.stocks,
        stockSummary: state.stockSummary,
        count: state.count,
        next: state.next,
        previous: state.previous,
        filters: state.filters,
      }),
    }
  )
);

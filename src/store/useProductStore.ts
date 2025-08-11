import { create } from 'zustand';
import { produce } from 'immer';
import ApiService from '@/lib/apiService';
import type { ProductInterface } from '@/types/types';

interface ProductAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductInterface[];
}

interface ProductState {
  products: ProductInterface[];
  selectedProduct: ProductInterface | null;
  count: number;
  next: string | null;
  previous: string | null;

  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;

  fetchProducts: (params?: Record<string, any>) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (product: FormData) => Promise<void>;
  updateProduct: (id: string, product: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  clearError: () => void;
  clearSelectedProduct: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,
  count: 0,
  next: null,
  previous: null,

  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,

  clearError: () => set({ error: null }),
  clearSelectedProduct: () => set({ selectedProduct: null }),

  // Fetch products with optional filters + pagination
  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiService.get<ProductAPIResponse>('/products/', { params });

      if (Array.isArray(response)) {
        // Non-paginated response
        set({
          products: response,
          count: response.length,
          next: null,
          previous: null,
          isLoading: false,
        });
      } else {
        // Paginated response
        set({
          products: response.results ?? [],
          count: response.count ?? 0,
          next: response.next ?? null,
          previous: response.previous ?? null,
          isLoading: false,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      console.error('Error fetching products:', err);
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Fetch single product
  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const product = await ApiService.get<ProductInterface>(`/products/${id}/`);
      set({ selectedProduct: product, isLoading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      console.error('Error fetching product by ID:', err);
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Create new product
  createProduct: async (product) => {
    set({ isCreating: true, error: null });
    try {
      const newProduct = await ApiService.post<ProductInterface>(
        '/products/',
        product,
        true // multipart/form-data
      );

      set(
        produce((state: ProductState) => {
          state.products.unshift(newProduct);
          state.count += 1;
          state.isCreating = false;
        })
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      console.error('Error creating product:', err);
      set({ error: errorMessage, isCreating: false });
      throw err;
    }
  },

  // Update existing product
  updateProduct: async (id, product) => {
    set({ isUpdating: true, error: null });
    try {
      const updatedProduct = await ApiService.put<ProductInterface>(
        `/products/${id}/`,
        product,
        true // multipart/form-data
      );

      set(
        produce((state: ProductState) => {
          const index = state.products.findIndex((p) => p.id === id);
          if (index !== -1) state.products[index] = updatedProduct;
          if (state.selectedProduct?.id === id) {
            state.selectedProduct = updatedProduct;
          }
          state.isUpdating = false;
        })
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      console.error('Error updating product:', err);
      set({ error: errorMessage, isUpdating: false });
      throw err;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    set({ isDeleting: true, error: null });
    try {
      await ApiService.delete(`/products/${id}/`);
      set(
        produce((state: ProductState) => {
          state.products = state.products.filter((p) => p.id !== id);
          state.count -= 1;
          state.isDeleting = false;
        })
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      console.error('Error deleting product:', err);
      set({ error: errorMessage, isDeleting: false });
      throw err;
    }
  },
}));

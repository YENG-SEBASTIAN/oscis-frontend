import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import ApiService from '@/lib/apiService';
import { ImageInterface } from '@/types/types';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: ImageInterface;
  alt_text: string;
  display_order: number;
  is_active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface CategoryAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  count: number;
  next: string | null;
  previous: string | null;

  fetchCategories: (params?: Record<string, any>) => Promise<void>;
  createCategory: (data: Partial<Category>) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>()(
  devtools((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,
    count: 0,
    next: null,
    previous: null,

    fetchCategories: async (params = {}) => {
      set({ isLoading: true, error: null });
      try {
        const response = await ApiService.get<CategoryAPIResponse>('/categories/', { params });

        set({
          categories: response.results ?? [],
          count: response.count ?? 0,
          next: response.next,
          previous: response.previous,
          isLoading: false,
        });
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        set({
          error: error?.response?.data?.detail || 'Failed to load categories',
          isLoading: false,
        });
      }
    },

    createCategory: async (data) => {
      set({ isLoading: true, error: null });
      try {
        await ApiService.post('/categories/', data);
        await get().fetchCategories();
      } catch (error: any) {
        console.error('Error creating category:', error);
        set({
          error: error?.response?.data?.detail || 'Failed to create category',
        });
      } finally {
        set({ isLoading: false });
      }
    },

    updateCategory: async (id, data) => {
      set({ isLoading: true, error: null });
      try {
        await ApiService.patch(`/categories/${id}/`, data);
        await get().fetchCategories();
      } catch (error: any) {
        console.error('Error updating category:', error);
        set({
          error: error?.response?.data?.detail || 'Failed to update category',
        });
      } finally {
        set({ isLoading: false });
      }
    },

    deleteCategory: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await ApiService.delete(`/categories/${id}/`);
        await get().fetchCategories();
      } catch (error: any) {
        console.error('Error deleting category:', error);
        set({
          error: error?.response?.data?.detail || 'Failed to delete category',
        });
      } finally {
        set({ isLoading: false });
      }
    },
  }))
);



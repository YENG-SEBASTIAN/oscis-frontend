import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import ApiService from '@/lib/apiService';

export interface CategoryImage {
  id: string;
  name: string;
  url: string;
  file_type: string;
  mime_type: string;
  file_size: string;
  dimensions: {
    width: number;
    height: number;
  };
  alt_text: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: CategoryImage;
  display_order: number;
  is_active: boolean;
  featured: boolean;
  product_count: number | null;
  created_at: string;
  updated_at: string;
}

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>()(
  devtools((set) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
      set({ isLoading: true, error: null });

      try {
        const response = await ApiService.get<{ results: Category[] }>('/categories/');
        const results = response?.results || [];

        set({ categories: results, isLoading: false });
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        set({
          error: error?.response?.data?.detail || 'Failed to load categories',
          isLoading: false,
        });
      }
    },
  }))
);

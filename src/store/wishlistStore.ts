import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import ApiService from '@/lib/apiService';
import { ProductInterface } from '@/types/types';

export interface WishlistItem {
  id: string;
  product: ProductInterface;
  created_at: string;
}

interface WishlistState {
  wishlist: WishlistItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;

  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      loading: false,
      error: null,
      totalCount: 0,

      // Fetch all wishlist items
      fetchWishlist: async () => {
        set({ loading: true, error: null });
        try {
          const data = await ApiService.get<{ results: WishlistItem[] }>('/wishlist/');
          set({
            wishlist: data.results,
            totalCount: data.results.length,
            loading: false,
          });
        } catch (err: any) {
          set({
            error: err.message || 'Failed to fetch wishlist',
            loading: false,
          });
        }
      },

      // Add or remove product from wishlist
      toggleWishlist: async (productId: string) => {
        try {
          const data = await ApiService.post<{
            status: string;
            is_wishlisted: boolean;
            item?: WishlistItem;
          }>('/wishlist/toggle/', { product_id: productId });

          if (data.is_wishlisted && data.item) {
            set((state) => {
              const exists = state.wishlist.some(
                (w) => w.product.id === data.item!.product.id
              );
              if (exists) return state;

              const updatedWishlist = [...state.wishlist, data.item as WishlistItem];
              return { wishlist: updatedWishlist, totalCount: updatedWishlist.length };
            });
          } else {
            set((state) => {
              const updatedWishlist = state.wishlist.filter((w) => w.product.id !== productId);
              return { wishlist: updatedWishlist, totalCount: updatedWishlist.length };
            });
          }
        } catch (err: any) {
          set({ error: err.message || 'Failed to toggle wishlist' });
        }
      },

      isWishlisted: (productId: string) => {
        return get().wishlist.some((w) => w.product.id === productId);
      },

      clearWishlist: () => set({ wishlist: [], totalCount: 0 }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import ApiService from "@/lib/apiService";
import toast from "react-hot-toast";
import { ProductInterface } from "@/types/types";

// Backend cart item structure
export interface BackendCartItem {
  id: string;
  product: ProductInterface;
  quantity: number;
  price: number;
  total_price: number;
}

// Backend cart structure
export interface BackendCart {
  id: string;
  user: string;
  session_key: string | null;
  is_active: boolean;
  items: BackendCartItem[];
  total_price: number;
}

// Frontend cart item
export interface CartItem {
  id: string;
  productId: string;
  product: ProductInterface;
  name: string;
  price: number;
  image: string;
  quantity: number;
  total_price: number;
  slug: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemsCount: number;
  isLoading: boolean;
  error: string | null;
  cartId: string | null;

  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  increaseQuantity: (itemId: string) => Promise<void>;
  decreaseQuantity: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  getItemByProductId: (productId: string) => CartItem | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const transformCartItem = (backendItem: BackendCartItem): CartItem => ({
  id: backendItem.id,
  productId: backendItem.product.id,
  product: backendItem.product,
  name: backendItem.product.name,
  price: backendItem.price,
  image: backendItem.product.primary_image?.url || '',
  quantity: backendItem.quantity,
  total_price: backendItem.total_price,
  slug: backendItem.product.slug,
});

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemsCount: 0,
      isLoading: false,
      error: null,
      cartId: null,

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),

      // Fetch cart
      fetchCart: async () => {
        const { setLoading, setError } = get();
        try {
          setLoading(true);
          setError(null);

          const cart: BackendCart = await ApiService.get('/cart/');
          const transformedItems = cart.items.map(transformCartItem);

          set({
            items: transformedItems,
            total: cart.total_price,
            itemsCount: transformedItems.reduce((sum, item) => sum + item.quantity, 0),
            cartId: cart.id,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Error fetching cart:', error);
          setError('Failed to load cart, You are probably logged out. Try login');
          set({ isLoading: false });
          toast.error('Failed to load cart');
        }
      },

      // Add item
      addItem: async (productId: string, quantity: number = 1) => {
        const { setLoading, setError, fetchCart, items } = get();
        try {
          setLoading(true);
          setError(null);

          const productExists = items.some(item => item.productId === productId);
          if (productExists) {
            toast.success('This product is already in your cart. The quantity will be updated');
          }

          await ApiService.post('/cart/add/', { product: productId, quantity });
          await fetchCart();
          toast.success('Item added to cart');
        } catch (error: any) {
          console.error('Error adding item:', error);
          setError('Failed to add item');
          toast.error(error.response?.data?.error || 'Failed to add item');
        } finally {
          setLoading(false);
        }
      },

      // Remove item
      removeItem: async (itemId: string) => {
        const { setLoading, setError, fetchCart } = get();
        try {
          setLoading(true);
          setError(null);

          await ApiService.delete(`/cart/remove/${itemId}/`);
          await fetchCart();
          toast.success('Item removed from cart');
        } catch (error: any) {
          console.error('Error removing item:', error);
          setError('Failed to remove item');
          set({ isLoading: false });
          toast.error(error.response?.data?.error || 'Failed to remove item');
        }
      },

      // Update quantity
      updateQuantity: async (itemId: string, quantity: number) => {
        const { setLoading, setError, fetchCart } = get();
        if (quantity <= 0) return get().removeItem(itemId);

        try {
          setLoading(true);
          setError(null);

          await ApiService.patch(`/cart/update/${itemId}/`, { quantity });
          await fetchCart();
        } catch (error: any) {
          console.error('Error updating quantity:', error);
          setError('Failed to update quantity');
          set({ isLoading: false });
          toast.error(error.response?.data?.error || 'Failed to update quantity');
        }
      },

      increaseQuantity: async (itemId: string) => {
        const item = get().items.find(i => i.id === itemId);
        if (item) await get().updateQuantity(itemId, item.quantity + 1);
      },

      decreaseQuantity: async (itemId: string) => {
        const item = get().items.find(i => i.id === itemId);
        if (item) await get().updateQuantity(itemId, item.quantity - 1);
      },

      // Clear cart
      clearCart: async () => {
        const { setLoading, setError } = get();
        try {
          setLoading(true);
          setError(null);

          await ApiService.delete('/cart/clear/');
          set({ items: [], total: 0, itemsCount: 0, isLoading: false });
          toast.success('Cart cleared successfully');
        } catch (error: any) {
          console.error('Error clearing cart:', error);
          setError('Failed to clear cart');
          set({ isLoading: false });
          toast.error(error.response?.data?.error || 'Failed to clear cart');
        }
      },

      // Utility
      getItemByProductId: (productId: string) => get().items.find(item => item.productId === productId),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        itemsCount: state.itemsCount,
        cartId: state.cartId,
      }),
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import ApiService from "@/lib/apiService";
import toast from "react-hot-toast";
import { ProductInterface } from "@/types/types";

// Backend cart item structure (matching your Django response)
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

// Frontend cart item (simplified for UI)
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
  // State
  items: CartItem[];
  total: number;
  isLoading: boolean;
  error: string | null;
  cartId: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  increaseQuantity: (itemId: string) => Promise<void>;
  decreaseQuantity: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  // Utilities
  getItemByProductId: (productId: string) => CartItem | undefined;
  getTotalItems: () => number;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Helper function to transform backend cart item to frontend format
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
      // Initial state
      items: [],
      total: 0,
      isLoading: false,
      error: null,
      cartId: null,

      // Set loading state
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Set error state
      setError: (error: string | null) => set({ error }),

      // Fetch cart from backend
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
            cartId: cart.id,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Error fetching cart:', error);
          setError('Failed to load cart, Your are probably logged out. Try login');
          set({ isLoading: false });
          toast.error('Failed to load cart');
        }
      },

      // Add item to cart
      addItem: async (productId: string, quantity: number = 1) => {
        const { setLoading, setError, fetchCart, items } = get();

        try {
          setLoading(true);
          setError(null);

          // Check if product is already in cart
          const productExists = items.some(item => item.productId === productId);
          if (productExists) {
            toast.success('This product is already in your cart. The quantity will be updated');
          }

          // Add or update product in cart
          await ApiService.post('/cart/add/', {
            product: productId,
            quantity,
          });

          // Refresh cart state
          await fetchCart();
          toast.success('Item added to cart');
        } catch (error: any) {
          console.error('Error adding item to cart:', error);
          setError('Failed to add item to cart');
          toast.error(error.response?.data?.error || 'Failed to add item to cart');
        } finally {
          setLoading(false);
        }
      },



      // Remove item from cart
      removeItem: async (itemId: string) => {
        const { setLoading, setError, fetchCart } = get();
        try {
          setLoading(true);
          setError(null);

          await ApiService.delete(`/cart/remove/${itemId}/`);

          // Refresh cart from backend
          await fetchCart();
          toast.success('Item removed from cart');
        } catch (error: any) {
          console.error('Error removing item from cart:', error);
          setError('Failed to remove item from cart');
          set({ isLoading: false });
          toast.error(error.response?.data?.error || 'Failed to remove item from cart');
        }
      },

      // Update item quantity
      updateQuantity: async (itemId: string, quantity: number) => {
        const { setLoading, setError, fetchCart } = get();

        if (quantity <= 0) {
          // If quantity is 0 or less, remove the item
          return get().removeItem(itemId);
        }

        try {
          setLoading(true);
          setError(null);

          await ApiService.patch(`/cart/update/${itemId}/`, {
            quantity: quantity,
          });

          // Refresh cart from backend
          await fetchCart();
        } catch (error: any) {
          console.error('Error updating item quantity:', error);
          setError('Failed to update item quantity');
          set({ isLoading: false });
          toast.error(error.response?.data?.error || 'Failed to update item quantity');
        }
      },

      // Increase quantity by 1
      increaseQuantity: async (itemId: string) => {
        const item = get().items.find(i => i.id === itemId);
        if (item) {
          await get().updateQuantity(itemId, item.quantity + 1);
        }
      },

      // Decrease quantity by 1
      decreaseQuantity: async (itemId: string) => {
        const item = get().items.find(i => i.id === itemId);
        if (item) {
          await get().updateQuantity(itemId, item.quantity - 1);
        }
      },

      // Clear entire cart
      clearCart: async () => {
        const { setLoading, setError } = get();
        try {
          setLoading(true);
          setError(null);

          await ApiService.delete('/cart/clear/');

          set({
            items: [],
            total: 0,
            isLoading: false,
          });

          toast.success('Cart cleared');
        } catch (error: any) {
          console.error('Error clearing cart:', error);
          setError('Failed to clear cart');
          set({ isLoading: false });
          toast.error(error.response?.data?.error || 'Failed to clear cart');
        }
      },

      // Get item by product ID
      getItemByProductId: (productId: string) => {
        return get().items.find(item => item.productId === productId);
      },

      // Get total number of items in cart
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // Persist cart state
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        cartId: state.cartId,
      }),
    }
  )
);
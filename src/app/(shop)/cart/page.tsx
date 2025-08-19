'use client';

import { useState, useEffect } from 'react';
import { Loader2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);

  const {
    items,
    total,
    isLoading,
    error,
    fetchCart,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    itemsCount,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const hasOutOfStock = items.some((item) => !item.product?.is_active);
    if (hasOutOfStock) {
      toast.error("Some items in your cart are out of stock");
      return;
    }

    toast.success("Redirecting to Order Summary...");
    router.push("/payment");
  };

  // Loading state
  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600" />
          <p className="mt-2 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">Error loading cart: {error}</p>
          <button
            onClick={fetchCart}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Confirm Clear Cart Modal */}
      <ConfirmDeleteModal
        isOpen={isClearCartModalOpen}
        onClose={() => setIsClearCartModalOpen(false)}
        onConfirm={handleClearCart}
        title="Clear Cart Confirmation"
        description="Are you sure you want to remove all items from your cart?"
      />

      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
                  <button
                    onClick={() => setIsClearCartModalOpen(true)}
                    disabled={isLoading}
                    className="text-sm text-red-600 hover:text-red-700 transition disabled:opacity-50"
                  >
                    Clear Cart
                  </button>
                </div>

                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      isLoading={isLoading}
                      onRemove={removeItem}
                      onIncrease={increaseQuantity}
                      onDecrease={decreaseQuantity}
                    />
                  ))}
                </ul>
              </div>

              {/* Cart Summary */}
              <CartSummary
                totalItems={itemsCount}
                total={total}
                isLoading={isLoading}
                onCheckout={handleCheckout}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Minus, ArrowRight, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import { MediaBaseUrl } from '@/lib/axios';

export default function CartPage() {
  const router = useRouter();
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
  console.log("MediaBaseUrl ", MediaBaseUrl)
  const {
    items,
    total,
    isLoading,
    error,
    fetchCart,
    updateQuantity,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getTotalItems,
  } = useCartStore();

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      await updateQuantity(itemId, newQty);
    } catch (error) {
      console.log("error ", error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.log("error ", error);
    }
  };

  const handleIncreaseQuantity = async (itemId: string) => {
    try {
      await increaseQuantity(itemId);
    } catch (error) {
      console.log("error ", error);
    }
  };

  const handleDecreaseQuantity = async (itemId: string) => {
    try {
      await decreaseQuantity(itemId);
    } catch (error) {
      console.log("error ", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.log("error ", error);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const hasOutOfStockItems = items.some(item => !item.product?.is_active);
    if (hasOutOfStockItems) {
      toast.error('Some items in your cart are out of stock');
      return;
    }

    toast.success('Redirecting to checkout...');
    router.push('/checkout');
  };

  const totalItems = getTotalItems();

  // Loading state
  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600" />
            <p className="mt-2 text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Error loading cart: {error}</p>
              <button
                onClick={fetchCart}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Clear Cart Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isClearCartModalOpen}
        onClose={() => setIsClearCartModalOpen(false)}
        onConfirm={handleClearCart}
        title="Clear Cart Confirmation"
        description="Are you sure you want to remove all items from your cart?"
      />

      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-extrabold text-gray-900">Your Cart</h1>
              <p className="text-gray-600 mt-2">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={() => setIsClearCartModalOpen(true)}
                disabled={isLoading}
                className="text-sm text-red-600 hover:text-red-700 transition disabled:opacity-50 cursor-pointer"
              >
                Clear Cart
              </button>
            )}
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-12 h-12 mx-auto text-gray-300" />
                <h2 className="mt-4 text-xl font-semibold text-gray-800">Your cart is empty</h2>
                <p className="mt-1 text-gray-500">Start adding some amazing products.</p>
                <Link
                  href="/products"
                  className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                )}

                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (

                    <li key={item.id} className="flex items-start gap-4 p-5 hover:bg-gray-50 relative">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        <div className="relative w-20 h-20">
                          <Image
                            src={MediaBaseUrl + item.product.primary_image?.url}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-image.png';
                            }}
                          />
                        </div>

                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)}</p>
                            <Link
                              href={`/products/${item.slug}`}
                              className="text-xs text-blue-600 hover:text-blue-700 transition"
                            >
                              View Product
                            </Link>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-rose-500 transition disabled:opacity-50"
                            aria-label="Remove item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => handleDecreaseQuantity(item.id)}
                              disabled={item.quantity <= 1 || isLoading}
                              className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 text-sm font-semibold min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncreaseQuantity(item.id)}
                              disabled={isLoading}
                              className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            ${item.total_price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <div className="flex justify-between text-lg font-medium text-gray-800 mb-2">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Shipping and taxes will be calculated during checkout.
                  </p>

                  <button
                    onClick={handleCheckout}
                    disabled={isLoading || items.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 text-white font-semibold bg-blue-600 hover:bg-blue-700 transition rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Proceed to Checkout <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <Link
                      href="/products"
                      className="text-sm text-blue-600 hover:text-blue-500 transition"
                    >
                      ← Continue Shopping
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

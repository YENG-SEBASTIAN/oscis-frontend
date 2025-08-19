'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface CartSummaryProps {
  totalItems: number;
  total: number;
  isLoading: boolean;
  onCheckout: () => void;
}

export default function CartSummary({
  totalItems,
  total,
  isLoading,
  onCheckout,
}: CartSummaryProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 h-fit">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Cart Summary</h2>
      <div className="flex justify-between text-gray-700 mb-2">
        <span>Subtotal ({totalItems} items)</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Shipping and taxes calculated at checkout.
      </p>

      <button
        onClick={onCheckout}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 text-white font-semibold bg-blue-600 hover:bg-blue-700 transition rounded-lg disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Checkout (${total.toFixed(2)}) <ArrowRight className="w-4 h-4" />
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
  );
}

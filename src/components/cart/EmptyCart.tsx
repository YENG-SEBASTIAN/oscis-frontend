'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function EmptyCart() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white shadow-md rounded-xl p-10 text-center max-w-md w-full">
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
    </div>
  );
}

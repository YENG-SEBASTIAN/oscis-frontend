'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CartButton() {
  const { itemsCount } = useCartStore();
  const [hydrated, setHydrated] = useState(false);

  // Ensure client & server HTML match
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Render a fallback that matches server-side HTML
    return (
      <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 group">
        <ShoppingCart size={20} className="group-hover:text-blue-600 text-blue-500" />
      </Link>
    );
  }

  return (
    <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 group">
      <ShoppingCart size={20} className="group-hover:text-blue-600 text-blue-500" />
      {itemsCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {itemsCount}
        </span>
      )}
    </Link>
  );
}

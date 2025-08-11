'use client';

import { ShoppingCart } from 'lucide-react';
import { ProductInterface } from '@/types/types';

interface AddToCartButtonProps {
  product: ProductInterface;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const handleClick = () => {
    alert(`Added ${product.name} to cart`);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition transform flex items-center space-x-2 shadow-lg"
      aria-label={`Add ${product.name} to cart`}
    >
      <ShoppingCart size={18} />
      <span>Add to Cart</span>
    </button>
  );
}

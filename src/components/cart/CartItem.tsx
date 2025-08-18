'use client';

import { X, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { MediaBaseUrl } from '@/lib/axios';

interface CartItemProps {
  item: any;
  isLoading: boolean;
  onRemove: (id: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
}

export default function CartItem({
  item,
  isLoading,
  onRemove,
  onIncrease,
  onDecrease,
}: CartItemProps) {
  return (
    <li className="flex items-start gap-4 py-5 hover:bg-gray-50">
      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
        <Image
          src={MediaBaseUrl + item.product.primary_image?.url}
          alt={item.name}
          width={80}
          height={80}
          className="object-cover rounded"
        />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)}</p>
            <Link
              href={`/products/${item.productId}`}
              className="text-xs text-blue-600 hover:text-blue-700 transition"
            >
              View Product
            </Link>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            disabled={isLoading}
            className="text-gray-400 hover:text-rose-500 transition disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => onDecrease(item.id)}
              disabled={item.quantity <= 1 || isLoading}
              className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 text-sm font-semibold min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onIncrease(item.id)}
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
  );
}

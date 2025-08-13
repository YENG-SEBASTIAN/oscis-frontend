'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProductInterface } from '@/types/types';
import { useCartStore } from '@/store/useCartStore';


interface ProductActionCallbacks {
  onAddToWishlist: (product: ProductInterface) => void;
}

interface ProductCardProps {
  product: ProductInterface;
  onAddToWishlist: ProductActionCallbacks['onAddToWishlist'];
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, onAddToWishlist }, ref) => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const {addItem} = useCartStore();

    useEffect(() => setMounted(true), []);

    // Defensive conversion of prices to numbers
    const price = Number(product.price);
    const originalPrice = Number(product.original_price);

    const discountAmount = useMemo(() => {
      if (isNaN(price) || isNaN(originalPrice) || originalPrice <= price) return '0.00';
      return (originalPrice - price).toFixed(2);
    }, [originalPrice, price]);

    const hasDiscount = originalPrice > price;
    const categoryName = product.category?.name || 'Uncategorized';

    const handleClick = () => mounted && router.push(`/products/${product.id}`);

    const handleAction = (
      e: React.MouseEvent,
      action: (product: ProductInterface) => void
    ) => {
      e.stopPropagation();
      action(product);
    };

    if (!mounted) {
      return (
        <div
          ref={ref}
          className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col"
          role="article"
          aria-label={`Product: ${product.name}`}
        >
          <div className="relative flex-1 overflow-hidden">
            <div className="w-full aspect-square relative bg-gray-100" />
          </div>
          <div className="p-6 flex flex-col">
            <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
            <div className="flex items-center mb-4">
              <StarRating rating={0} />
            </div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
            <div className="h-12 bg-gray-300 rounded-xl" />
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        onClick={handleClick}
        className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-blue-200 overflow-hidden cursor-pointer h-full flex flex-col transition-all duration-300 hover:-translate-y-2"
        role="article"
        aria-label={`Product: ${product.name}`}
      >
        <div className="relative flex-1 overflow-hidden">
          <div className="w-full aspect-square relative">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            {product.primary_image && (
              <Image
                src={product.primary_image.url}
                alt={product.primary_image.alt_text ?? product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                }}
              />
            )}
          </div>

          {product.badge && (
            <div className="absolute top-4 left-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                {product.badge}
              </span>
            </div>
          )}

          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <button
              onClick={(e) => handleAction(e, onAddToWishlist)}
              className="bg-white p-2 rounded-full shadow hover:bg-red-50 hover:scale-110 transition"
              aria-label={`Add ${product.name} to wishlist`}
            >
              <Heart size={18} className="text-gray-600 hover:text-red-500" />
            </button>
            <button
              onClick={() => handleClick()}
              className="bg-white p-2 rounded-full shadow hover:bg-blue-50 hover:scale-110 transition"
              aria-label={`View details for ${product.name}`}
            >
              <Eye size={18} className="text-gray-600 hover:text-blue-500" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition duration-300">
            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm text-gray-800 font-medium">
              {categoryName}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col">
          <h3 className="font-bold text-lg mb-3 text-gray-800 transition-colors group-hover:text-blue-600 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center mb-4">
            <StarRating rating={product.rating} />
            <span className="text-sm text-gray-500 ml-2 font-medium">
              ({product.review_count} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between mb-6 mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-800">
                ${isNaN(price) ? '0.00' : price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  ${isNaN(originalPrice) ? '0.00' : originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                Save ${discountAmount}
              </span>
            )}
          </div>

          <button
            onClick={() => addItem(product.id)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-bold transition transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex" aria-label={`Rating: ${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
        className="text-yellow-400 drop-shadow-sm"
      />
    ))}
  </div>
);

interface ProductListProps {
  products: ProductInterface[];
  onAddToWishlist: ProductActionCallbacks['onAddToWishlist'];
}

export const ProductList = React.forwardRef<HTMLDivElement, ProductListProps>(
  ({ products, onAddToWishlist }, ref) => (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToWishlist={onAddToWishlist}
        />
      ))}
    </div>
  )
);

ProductList.displayName = 'ProductList';
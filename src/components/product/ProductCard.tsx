'use client';

import React from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProductInterface } from '@/types/types';

interface ProductCardProps {
  product: ProductInterface;
  onAddToCart?: (product: ProductInterface) => void;
  onViewDetails?: (product: ProductInterface) => void;
  onAddToWishlist?: (product: ProductInterface) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart = () => {},
  onViewDetails = () => {},
  onAddToWishlist = () => {},
}) => {
  const saveAmount = (product.originalPrice - product.price).toFixed(2);
  const router = useRouter();

  const handleProductClick = () => {
    router.push(`/products/${product.id}`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(product);
  };

  return (
    <div
      onClick={handleProductClick}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-blue-200 overflow-hidden transform hover:-translate-y-2 transition-all duration-500 group cursor-pointer h-full flex flex-col"
    >
      <div className="relative overflow-hidden flex-1">
        <div className="w-full h-72 relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {product.badge && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
              {product.badge}
            </span>
          </div>
        )}

        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist(product);
            }}
            className="bg-white p-2 rounded-full shadow hover:bg-red-50 hover:scale-110 transition"
            aria-label="Add to wishlist"
          >
            <Heart size={18} className="text-gray-600 hover:text-red-500" />
          </button>
          <button
            onClick={handleViewDetails}
            className="bg-white p-2 rounded-full shadow hover:bg-blue-50 hover:scale-110 transition"
            aria-label="View details"
          >
            <Eye size={18} className="text-gray-600 hover:text-blue-500" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition duration-300">
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm text-gray-800 font-medium">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col">
        <h3 className="font-bold text-lg mb-3 text-gray-800 transition-colors group-hover:text-blue-600 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                className="drop-shadow-sm"
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2 font-medium">
            ({product.reviews} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between mb-6 mt-auto">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-800">${product.price}</span>
            <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
          </div>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
            Save ${saveAmount}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-bold transition transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
          aria-label="Add to cart"
        >
          <ShoppingCart size={18} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

interface ProductListProps {
  products: ProductInterface[];
  onAddToCart?: (product: ProductInterface) => void;
  onViewDetails?: (product: ProductInterface) => void;
  onAddToWishlist?: (product: ProductInterface) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddToCart,
  onViewDetails,
  onAddToWishlist,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
          onAddToWishlist={onAddToWishlist}
        />
      ))}
    </div>
  );
};

export default ProductList;

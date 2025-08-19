'use client';

import { useEffect } from 'react';
import { Heart, HeartOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useWishlistStore } from '@/store/wishlistStore';
import { ProductInterface } from '@/types/types';

export default function Wishlist() {
  const {
    wishlist,
    loading,
    error,
    fetchWishlist,
    toggleWishlist,
    isWishlisted,
  } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleToggle = async (productId: string) => {
    await toggleWishlist(productId);
    toast.success(
      isWishlisted(productId) ? 'Added to wishlist' : 'Removed from wishlist'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Wishlist</h1>
        <div className="text-sm text-gray-600">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading wishlist...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {wishlist.length === 0 && !loading ? (
        <div className="text-center py-12">
          <HeartOff className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Your wishlist is empty
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Start adding items you love to your wishlist
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {wishlist.map((item) => {
            const product: ProductInterface = item.product;
            const wishlisted = isWishlisted(product.id);

            return (
              <div
                key={item.id}
                className="group relative flex flex-col bg-white rounded-lg shadow-sm overflow-hidden h-full"
              >
                {/* Product Image */}
                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden">
                  <Image
                    src={product.primary_image?.url || ''}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700 truncate">
                      <Link href={`/products/${product.id}`}>{product.name}</Link>
                    </h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Wishlist Toggle */}
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(product.id);
                      }}
                      className="flex items-center space-x-1 text-gray-400 hover:text-red-500"
                      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {wishlisted ? (
                        <>
                          <Heart className="h-6 w-6 fill-red-500 text-red-500" />
                          <span className="text-sm font-medium text-red-500">Remove</span>
                        </>
                      ) : (
                        <>
                          <HeartOff className="h-6 w-6" />
                          <span className="text-sm font-medium">Add</span>
                        </>
                      )}
                    </button>

                    {/* Buy Button */}
                    <Link
                      href={`/products/${product.id}`}
                      className={`ml-auto py-2 px-4 rounded-md text-white font-medium shadow-sm flex justify-center ${
                        product.is_active
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {product.is_active ? 'Buy Now' : 'Unavailable'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

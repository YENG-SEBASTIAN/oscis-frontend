'use client';

import { useState } from 'react';
import { Heart, HeartOff, X, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
};

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 199.99,
      image: '/headphones.jpg',
      inStock: true,
    },
    {
      id: '2',
      name: 'Ultra HD Smart TV',
      price: 899.99,
      image: '/tv.jpg',
      inStock: false,
    },
    {
      id: '3',
      name: 'Ergonomic Office Chair',
      price: 249.99,
      image: '/chair.jpg',
      inStock: true,
    },
  ]);

  const removeFromWishlist = (id: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    toast.success('Item removed from wishlist');
  };

  const toggleWishlistStatus = (id: string) => {
    setWishlistItems(wishlistItems.map(item => 
      item.id === id ? { ...item, inStock: !item.inStock } : item
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Wishlist</h1>
        <div className="text-sm text-gray-600">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <HeartOff className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
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
          {wishlistItems.map((item) => (
            <div key={item.id} className="group relative">
              <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-center object-cover group-hover:opacity-75"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link href={`/products/${item.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {item.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleWishlistStatus(item.id)}
                    className="text-gray-400 hover:text-red-500"
                    aria-label={item.inStock ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {item.inStock ? (
                      <Heart className="h-6 w-6 fill-red-500 text-red-500" />
                    ) : (
                      <HeartOff className="h-6 w-6" />
                    )}
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-gray-400 hover:text-gray-500"
                    aria-label="Remove item"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  disabled={!item.inStock}
                  className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    item.inStock
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {item.inStock ? 'Add to cart' : 'Out of stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
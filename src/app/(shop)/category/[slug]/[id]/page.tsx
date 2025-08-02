'use client';

import { notFound } from 'next/navigation';
import { categories } from '@/data/category';
import { ChevronLeft, ShoppingCart, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Params {
  params: {
    slug: string;
    id: string;
  };
}

export default function ProductDetailPage({ params }: Params) {
  // Find the category
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return notFound();

  // Find the product
  const product = category.products.find((p) => p.id === params.id);
  if (!product) return notFound();

  const handleAddToCart = () => {
    console.log('Added to cart:', product.id);
    // Add your cart logic here
  };

  const handleBuyNow = () => {
    console.log('Buy now:', product.id);
    // Add your checkout logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/category/${category.slug}`}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to {category.name}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.category}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {product.originalPrice && (
              <span className="text-green-600 font-medium">
                Save ${(product.originalPrice - product.price).toFixed(2)} (
                {Math.round(
                  ((product.originalPrice - product.price) / product.originalPrice) * 100
                )}
                %)
              </span>
            )}
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              onClick={handleAddToCart}
              className="flex-1 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              variant="outline"
              className="flex-1 py-6 border-2 border-gray-900 hover:bg-gray-100"
            >
              Buy Now
            </Button>
          </div>

          {/* Wishlist Button */}
          <Button variant="ghost" className="w-full">
            <Heart className="mr-2 h-5 w-5" />
            Add to Wishlist
          </Button>
        </div>
      </div>
    </div>
  );
}
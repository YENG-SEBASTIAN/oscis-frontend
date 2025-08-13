'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import {
  Shield,
  RefreshCw,
  Star,
  Check,
  Package,
  ShoppingCart as ShoppingCartIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { useProductStore } from '@/store/useProductStore';
import type { ProductInterface, ProductFeature, ConditionGuideItem, ProductImage } from '@/types/types';
import AddToCartButton from '@/components/cart/AddToCartButton';

interface ProductParams {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductParams) {
  // Unwrap the params promise using React.use()
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const {
    selectedProduct: product,
    products,
    isLoading,
    error,
    fetchProductById,
    clearSelectedProduct,
  } = useProductStore();

  const [relatedProducts, setRelatedProducts] = useState<ProductInterface[]>([]);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Clear previous product and fetch new one when ID changes
  useEffect(() => {
    if (id) {
      setHasAttemptedFetch(false);
      setSelectedImageIndex(0);
      clearSelectedProduct();
      fetchProductById(id).finally(() => {
        setHasAttemptedFetch(true);
      });
    }
  }, [id, fetchProductById, clearSelectedProduct]);

  // Compute related products based on category
  useEffect(() => {
    if (product?.category && products.length > 0) {
      const related = products.filter(
        (p) => p.category?.id === product.category?.id && p.id !== product.id
      );
      setRelatedProducts(related.slice(0, 4));
    }
  }, [product, products]);

  // If no id param, show 404
  if (!id) return notFound();

  // Loading state
  if (isLoading || !hasAttemptedFetch) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <ProductCardSkeleton />
      </main>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <ErrorState error={error} onRetry={() => fetchProductById(id)} />
    );
  }

  // No product found after fetch attempt
  if (!product && hasAttemptedFetch) return notFound();

  // Fallback loading state
  if (!product) return <ProductCardSkeleton />;

  const allImages: ProductImage[] = [
    product.primary_image,
    ...(product.images?.map(img => img.image) || [])
  ].filter(Boolean) as ProductImage[];

  const currentImage = allImages[selectedImageIndex];



  // Pricing info
  const price = product.price;
  const originalPrice = product.original_price;
  const discountPercentage = product.discount_percentage ||
    (originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
  const amountSaved = originalPrice ? originalPrice - price : 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Product Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative w-full h-[500px] rounded-xl overflow-hidden border-2 border-gray-100">
                <Image
                  src={currentImage?.url || '/placeholder-product.jpg'}
                  alt={currentImage?.alt_text || product.name}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Image Navigation */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev =>
                        prev === 0 ? allImages.length - 1 : prev - 1
                      )}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev =>
                        prev === allImages.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Image Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${index === selectedImageIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <Image
                        src={image.url}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Authentic Product Guarantee</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {product.category && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {product.category.name}
                    </span>
                  )}
                  {product.badge && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {product.badge}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{product.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm">({product.review_count} reviews)</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-4xl font-bold text-blue-600">${price.toFixed(2)}</span>
                  {originalPrice && (
                    <span className="line-through text-gray-400 text-xl">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {originalPrice && amountSaved > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="bg-red-100 text-red-800 text-sm font-bold px-3 py-1 rounded-full">
                        {discountPercentage}% OFF
                      </span>
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        Save ${amountSaved.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      You save <span className="font-semibold text-green-600">${amountSaved.toFixed(2)}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <AddToCartButton product={product} />

              {/* Quick Product Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <span className="font-medium text-gray-900">Condition</span>
                  <p className="text-gray-600 mt-1">Pre-owned • Excellent</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <span className="font-medium text-gray-900">Authenticity</span>
                  <p className="text-gray-600 mt-1">100% Genuine</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features & Condition Guide */}
          <div className="border-t border-gray-200 px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Features */}
              {product.features?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Product Features
                  </h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          {feature.title && (
                            <span className="font-medium text-gray-900">{feature.title}</span>
                          )}
                          <p className="text-gray-700">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Condition Guide */}
              {product.condition_guide?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Condition Guide
                  </h3>
                  <div className="space-y-3">
                    {product.condition_guide.map((condition, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-semibold text-gray-900">{condition.rating}</span>
                        <span className="text-gray-600">{condition.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <a href={`/products/${product.id}`} className="block">
                        <div className="relative h-48">
                          <Image
                            src={product.primary_image?.url || '/placeholder-product.jpg'}
                            alt={product.primary_image?.alt_text || product.name}
                            fill
                            className="object-cover"
                          />
                          {product.discount_percentage && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              -{product.discount_percentage}%
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h4>
                          {product.category && (
                            <p className="text-xs text-gray-500 mb-2">{product.category.name}</p>
                          )}
                          <div className="flex items-center space-x-1 mb-2">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-600">{product.rating}</span>
                            {product.review_count && (
                              <span className="text-xs text-gray-400">({product.review_count})</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-blue-600">${product.price.toFixed(2)}</span>
                            {product.original_price && (
                              <span className="line-through text-gray-400 text-sm">
                                ${product.original_price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center mb-6">
        <RefreshCw className="mx-auto mb-4 w-12 h-12 text-red-500 animate-spin" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Product</h2>
        <p className="text-red-500">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Retry
      </button>
    </main>
  );
}
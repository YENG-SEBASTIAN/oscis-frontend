'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { ProductList } from '@/components/product/ProductCard';
import { useProductStore } from '@/store/useProductStore';
import type { ProductInterface } from '@/types/types';
import PaginationControls from '@/components/common/PaginationControls';

export default function ProductsPage() {
  const {
    products,
    isLoading,
    error,
    count,
    next,
    previous,
    fetchProducts,
  } = useProductStore();

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch initial & page data
  useEffect(() => {
    fetchProducts({ page: currentPage });
  }, [fetchProducts, currentPage]);

  const handleAddToCart = (product: ProductInterface) => {
    console.log('Added to cart:', product);
  };

  const handleViewDetails = (product: ProductInterface) => {
    console.log('View details of:', product);
  };

  const handleAddToWishlist = (product: ProductInterface) => {
    console.log('Added to wishlist:', product);
  };

  // Pagination handlers
  const handleNext = useCallback(() => {
    if (next) {
      const page = Number(new URL(next).searchParams.get('page') || currentPage + 1);
      setCurrentPage(page);
    }
  }, [next, currentPage]);

  const handlePrev = useCallback(() => {
    if (previous) {
      const page = Number(new URL(previous).searchParams.get('page') || currentPage - 1);
      setCurrentPage(page);
    }
  }, [previous, currentPage]);

  const handleRetry = () => fetchProducts({ page: currentPage });

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Error loading products
            </h3>
            <p className="text-red-600 mb-4">
              {error || 'Failed to load products. Please try again.'}
            </p>
            <Button
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-100"
              onClick={handleRetry}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8">
      <section className="mb-16">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            All Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our complete collection of premium products
          </p>
        </div>

        {/* Loading */}
        {isLoading && products.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        )}

        {/* Products */}
        {!isLoading && products.length > 0 && (
          <>
            <ProductList
              products={products}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
              onAddToWishlist={handleAddToWishlist}
            />
            <PaginationControls
              count={count}
              currentCount={products.length}
              next={next}
              previous={previous}
              isLoading={isLoading}
              onNext={handleNext}
              onPrev={handlePrev}
              itemLabel="products"
            />
          </>
        )}

        {/* Empty state */}
        {!isLoading && products.length === 0 && (
          <p className="text-center text-gray-500">No products found.</p>
        )}
      </section>
    </main>
  );
}

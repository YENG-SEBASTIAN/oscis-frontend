'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CategoryCard from '@/components/common/CategoryCard';
import { useCategoryStore } from '@/store/useCategoryStore';
import { Button } from '@/components/ui/button';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import PaginationControls from '@/components/common/PaginationControls';

const SKELETON_COUNT = 8;

export default function Category() {
  const router = useRouter();
  const {
    categories,
    fetchCategories,
    isLoading,
    error,
    count,
    next,
    previous,
  } = useCategoryStore();

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch initial page
  useEffect(() => {
    fetchCategories({ page: currentPage });
  }, [fetchCategories, currentPage]);

  // Handlers for pagination
  const handleNext = useCallback(() => {
    if (next) {
      const nextPage = Number(new URL(next).searchParams.get('page') || currentPage + 1);
      setCurrentPage(nextPage);
    }
  }, [next, currentPage]);

  const handlePrev = useCallback(() => {
    if (previous) {
      const prevPage = Number(new URL(previous).searchParams.get('page') || currentPage - 1);
      setCurrentPage(prevPage);
    }
  }, [previous, currentPage]);

  const handleRetry = () => fetchCategories({ page: currentPage });

  return (
    <section
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
      aria-labelledby="category-heading"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            id="category-heading"
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-800"
          >
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect footwear for every occasion and style
          </p>
        </div>

        {/* Loading State */}
        {isLoading && categories.length === 0 && (
          <div
            role="status"
            aria-live="polite"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ProductCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-4 md:p-8">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <div className="flex flex-col items-center text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-red-800 mb-2">
                  Error loading categories
                </h3>
                <p className="text-red-600 mb-4">
                  {error || 'Failed to load category. Please try again.'}
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
        )}

        {/* Success State */}
        {!isLoading && !error && categories.length > 0 && (
          <>
            {/* Category Grid */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12"
            >
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  image={category.image.url}
                  onClick={() => router.push(`/category/${category.slug}`)}
                />
              ))}
            </div>

            {/* Pagination */}
            <PaginationControls
              count={count}
              currentCount={categories.length}
              next={next}
              previous={previous}
              isLoading={isLoading}
              onNext={handleNext}
              onPrev={handlePrev}
              itemLabel="categories"
            />
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No categories found</p>
          </div>
        )}
      </div>
    </section>
  );
}

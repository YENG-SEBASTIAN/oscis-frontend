'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CategoryCard from '@/components/common/CategoryCard';
import { useCategoryStore } from '@/store/useCategoryStore';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';

const Category = () => {
  const router = useRouter();
  const { categories, fetchCategories, isLoading, error } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect footwear for every occasion and style
          </p>
        </div>

        {isLoading && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              image={category.image.url}
              onClick={() => router.push(`/category/${category.slug}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;

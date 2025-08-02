'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CategoryCard from '@/components/common/CategoryCard';
import { categories } from '@/data/category';

const Category = () => {
  const router = useRouter();

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect footwear for every occasion and style
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              name={category.name}
              count={category.count}
              image={category.image}
              onClick={() => router.push(`/category/${category.slug}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;

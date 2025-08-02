'use client';

import Hero from '@/components/common/Hero';

import Category from './(shop)/category/page';
import Products from './(shop)/products/page';


export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Category />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Products />
      </div>
    </div>
  );
}
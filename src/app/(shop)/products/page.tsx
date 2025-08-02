'use client';

import React from 'react';
import { featuredProducts } from '@/data/products';
import ProductList from '@/components/product/ProductCard';
import { ProductInterface } from '@/types/types';

const Products: React.FC = () => {
  const handleAddToCart = (product: ProductInterface) => {
    console.log('Added to cart:', product);
  };

  const handleViewDetails = (product: ProductInterface) => {
    console.log('View details of:', product);
  };

  const handleAddToWishlist = (product: ProductInterface) => {
    console.log('Added to wishlist:', product);
  };

  return (
    <main className="p-4 md:p-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Featured Products</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Handpicked premium shoes that combine style, comfort, and quality
        </p>
      </div>
      <ProductList
        products={featuredProducts}
        onAddToCart={handleAddToCart}
        onViewDetails={handleViewDetails}
        onAddToWishlist={handleAddToWishlist}
      />
    </main>
  );
};

export default Products;

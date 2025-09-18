'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Filter, Grid, List, SortAsc } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { ProductList } from '@/components/product/ProductCard';
import type { ProductInterface } from '@/types/types';

export default function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && slug) {
      // Validate slug format
      if (typeof slug !== 'string' || slug.trim() === '') {
        notFound();
        return;
      }
      
      fetchProducts({ category: slug });
    }
  }, [slug, fetchProducts, mounted]);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  if (!slug) {
    notFound();
    return null;
  }

  const formattedCategoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  const productCount = products?.length || 0;
  const productCountText = `${productCount} ${productCount === 1 ? 'product' : 'products'}`;

  const sortedProducts = products ? [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      default:
        return 0;
    }
  }) : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 sm:mb-8" aria-label="Breadcrumb">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Home
            </Link>
            <ChevronLeft className="h-4 w-4 text-gray-400 rotate-180" />
            <Link
              href="/category"
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Categories
            </Link>
            <ChevronLeft className="h-4 w-4 text-gray-400 rotate-180" />
            <span className="text-gray-900 font-medium capitalize">
              {formattedCategoryName}
            </span>
          </div>
        </nav>

        {/* Back Link */}
        <section className="mb-6 sm:mb-8">
          <Link
            href="/category"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors duration-200 group"
          >
            <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to all categories
          </Link>
        </section>

        {/* Category Header */}
        <section className="mb-8 sm:mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 capitalize">
                {formattedCategoryName}
              </h1>
              
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500">Loading products...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-red-700 font-medium">Error loading products</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <button
                    onClick={() => fetchProducts({ category: slug })}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <p className="text-gray-600">
                  {productCount > 0 ? (
                    <span className="font-medium text-blue-600">{productCountText}</span>
                  ) : (
                    'No products found in this category'
                  )}
                  {productCount > 0 && ' found'}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Filters and Controls */}
        {!isLoading && !error && productCount > 0 && (
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-3">
                  <SortAsc className="h-5 w-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-black text-black rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white text-gray-600 shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-white text-gray-600 shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Product Grid */}
        {!isLoading && !error && productCount > 0 && (
          <section>
            <ProductList
              products={sortedProducts}
            />
          </section>
        )}

        {/* Empty State */}
        {!isLoading && !error && productCount === 0 && (
          <section className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 max-w-md mx-auto">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No products found
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We couldn't find any products in the <strong className="capitalize">{formattedCategoryName}</strong> category at the moment.
              </p>
              <div className="space-y-3">
                <Link
                  href="/category"
                  className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Browse Other Categories
                </Link>
                <button
                  onClick={() => fetchProducts({ category: slug })}
                  className="inline-block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
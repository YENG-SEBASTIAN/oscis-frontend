'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Grid, ArrowRight } from 'lucide-react';
import { useCategoryStore } from '@/store/useCategoryStore';

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const mainNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Categories Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
              onClick={() => handleDropdownToggle('categories')}
              onMouseEnter={() => setActiveDropdown('categories')}
              onMouseLeave={() => setActiveDropdown(null)}
              aria-expanded={activeDropdown === 'categories'}
              aria-controls="categories-dropdown"
            >
              <Grid size={16} className="sm:w-5 sm:h-5" />
              <span className="font-medium sm:font-semibold hidden xs:inline">Browse Categories</span>
              <span className="font-medium sm:font-semibold xs:hidden">Categories</span>
              <ChevronDown 
                size={14} 
                className={`sm:w-[18px] sm:h-[18px] transition-transform duration-200 ${activeDropdown === 'categories' ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Categories Mega Menu */}
            {activeDropdown === 'categories' && (
              <div
                id="categories-dropdown"
                className="absolute top-full left-0 mt-3 w-[280px] xs:w-[320px] sm:w-[480px] md:w-[640px] lg:w-[920px] bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[80vh] overflow-y-auto"
                onMouseEnter={() => setActiveDropdown('categories')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Shop by Category</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Find the perfect footwear for every occasion</p>
                </div>
                
                {/* Categories Grid */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {categories.map((category) => (
                      <Link 
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        className="group relative overflow-hidden rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      >
                        <div className="p-3 sm:p-5">
                          {/* Category Image */}
                          <div className="relative w-full h-20 sm:h-24 mb-3 sm:mb-4 rounded-lg overflow-hidden">
                            <Image
                              src={category.image?.url || '/placeholder-category.jpg'}
                              alt={category.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                          </div>
                          
                          {/* Category Info */}
                          <div className="mb-2 sm:mb-3">
                            <h4 className="font-bold text-sm sm:text-lg group-hover:text-gray-900 transition-colors">
                              {category.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                              {category.description}
                            </p>
                          </div>

                          <ArrowRight 
                            size={14} 
                            className="absolute top-3 right-3 sm:top-5 sm:right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-600" 
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Bottom CTA */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Can't find what you're looking for?</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Browse our complete collection of products</p>
                    </div>
                    <Link
                      href="/products"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                    >
                      <span>View All Products</span>
                      <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {mainNavLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors relative group text-sm lg:text-base"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

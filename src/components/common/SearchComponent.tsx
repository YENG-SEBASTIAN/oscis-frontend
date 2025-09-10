'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Star, ArrowRight, Clock, Tag } from 'lucide-react';
import { useCategoryStore, Category } from '@/store/useCategoryStore';
import { useProductStore } from '@/store/useProductStore';
import { ProductInterface } from '@/types/types';

interface SearchResult {
  id: string | number;
  name: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  badge?: string | null;
  type: 'product' | 'category';
  price?: number;
  original_price?: number;
  rating?: number;
  review_count?: number;
  count?: number;
}

interface SearchComponentProps {
  isOpen?: boolean;
  onClose?: () => void;
  placeholder?: string;
  className?: string;
}

export default function SearchComponent({
  isOpen = false,
  onClose,
  placeholder = 'Search products, categories...',
  className = '',
}: SearchComponentProps) {
  const { categories, fetchCategories } = useCategoryStore();
  const { products, fetchProducts } = useProductStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState<string[]>(['Shoes', 'Bags', 'Watches']);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  /** -------------------------------
   * Load & Save Recent Searches
   * ------------------------------- */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentSearches');
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    } catch {
      /* ignore */
    }
  }, [recentSearches]);

  /** -------------------------------
   * Initial fetch
   * ------------------------------- */
  useEffect(() => {
    if (categories.length === 0) fetchCategories();
    if (products.length === 0) fetchProducts();
  }, [categories.length, products.length, fetchCategories, fetchProducts]);

  /** -------------------------------
   * Mapping Helpers
   * ------------------------------- */
  const mapProduct = (p: ProductInterface): SearchResult => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    image: p.primary_image?.url ?? undefined,
    badge: p.badge,
    type: 'product',
    price: p.price,
    original_price: p.original_price,
    rating: p.rating,
    review_count: p.review_count,
  });

  const mapCategory = (c: Category): SearchResult => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image?.url ?? undefined,
    type: 'category',
  });

  /** -------------------------------
   * Perform Search
   * ------------------------------- */
  const performSearch = async (query: string) => {
    const q = query.trim();
    if (!q) {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      await Promise.all([
        fetchProducts({ search: q }),
        fetchCategories({ search: q }),
      ]);

      const latestProducts = useProductStore.getState().products || [];
      const latestCategories = useCategoryStore.getState().categories || [];

      const prodResults = latestProducts.map(mapProduct);
      const catResults = latestCategories.map(mapCategory);

      const combined = [...prodResults, ...catResults];
      const normalizedQuery = q.toLowerCase();

      const sorted = combined.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        const aScore = aName.startsWith(normalizedQuery)
          ? 2
          : aName.includes(normalizedQuery)
          ? 1
          : 0;
        const bScore = bName.startsWith(normalizedQuery)
          ? 2
          : bName.includes(normalizedQuery)
          ? 1
          : 0;

        if (aScore !== bScore) return bScore - aScore;
        if (a.type !== b.type) return a.type === 'product' ? -1 : 1;

        if (a.type === 'product' && b.type === 'product') {
          return (b.rating ?? 0) - (a.rating ?? 0);
        }

        return 0;
      });

      setSearchResults(sorted.slice(0, 10));
      setShowResults(true);
    } catch {
      setSearchResults([]);
      setShowResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  /** -------------------------------
   * Debounced Search
   * ------------------------------- */
  useEffect(() => {
    const handler = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  /** -------------------------------
   * UI Interactions
   * ------------------------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      setShowResults(true);
    }
  }, [isOpen]);

  const handleSearch = (query?: string) => {
    const finalQuery = (query ?? searchQuery).trim();
    if (!finalQuery) return;

    setRecentSearches((prev) => {
      const updated = [finalQuery, ...prev.filter((t) => t !== finalQuery)].slice(
        0,
        5
      );
      return updated;
    });

    setSearchQuery(finalQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') {
      setShowResults(false);
      onClose?.();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const onResultClick = (name: string) => {
    setRecentSearches((prev) => {
      const updated = [name, ...prev.filter((t) => t !== name)].slice(0, 5);
      return updated;
    });
    setShowResults(false);
    onClose?.();
  };

  /** -------------------------------
   * Render
   * ------------------------------- */
  return (
    <div ref={searchContainerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="w-full pl-4 pr-12 py-3 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
          <button
            onClick={() => handleSearch()}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-hidden">
          {/* Loading */}
          {isSearching && (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Searching...</p>
            </div>
          )}

          {/* No Query → Suggestions */}
          {!searchQuery.trim() && !isSearching && (
            <div className="p-6">
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock size={16} className="text-gray-400" />
                    <h3 className="font-semibold text-gray-700">Recent Searches</h3>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {searchQuery.trim() && !isSearching && (
            <div className="max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700">
                      Search Results ({searchResults.length})
                    </h3>
                    <Link
                      href={`/category?q=${encodeURIComponent(searchQuery)}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <span>View all</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={
                          result.type === 'product'
                            ? `/products/${result.id}`
                            : `/category/${result.slug}`
                        }
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        onClick={() => onResultClick(result.name)}
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {result.image && (
                            <Image
                              src={result.image}
                              alt={result.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                              sizes="48px"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {result.name}
                            </h4>
                            {result.badge && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                {result.badge}
                              </span>
                            )}
                            {result.type === 'category' && (
                              <Tag size={14} className="text-green-500" />
                            )}
                          </div>

                          {result.description && (
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {result.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-1">
                            {result.type === 'product' ? (
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900">
                                  ${result.price?.toFixed(2)}
                                </span>
                                {result.original_price &&
                                  result.original_price > (result.price || 0) && (
                                    <span className="text-sm text-gray-400 line-through">
                                      ${result.original_price.toFixed(2)}
                                    </span>
                                  )}
                                {result.rating !== undefined && (
                                  <div className="flex items-center space-x-1">
                                    <Star
                                      size={12}
                                      className="text-yellow-400 fill-current"
                                    />
                                    <span className="text-xs text-gray-500">
                                      {result.rating} ({result.review_count ?? 0})
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">
                                {result.count ?? ''}
                              </span>
                            )}
                            <span className="text-xs text-gray-400 capitalize">
                              {result.type}
                            </span>
                          </div>
                        </div>

                        <ArrowRight
                          size={16}
                          className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    We couldn't find anything matching "{searchQuery}"
                  </p>
                  <div className="flex flex-col space-y-2">
                    <p className="text-xs text-gray-400">Try searching for:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {popularSearches.slice(0, 3).map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(suggestion)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Star, ArrowRight, TrendingUp, Clock, Tag } from 'lucide-react';
import { categories } from '@/data/category';

interface SearchResult {
  type: 'product' | 'category';
  id: string;
  name: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  badge?: string | null;
  category?: string;
  slug?: string;
  count?: string;
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
  placeholder = "Search products, brands, categories...",
  className = ""
}: SearchComponentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Nike sneakers', 'Formal shoes', 'Running boots'
  ]);
  const [popularSearches] = useState<string[]>([
    'Best sellers', 'New arrivals', 'Sale items', 'Sports shoes', 'Heels'
  ]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Get all products from categories for searching
  const allProducts = categories.flatMap(category => 
    category.products.map(product => ({
      ...product,
      type: 'product' as const
    }))
  );

  // Add categories as searchable items
  const allCategories = categories.map(category => ({
    type: 'category' as const,
    id: category.id,
    name: category.name,
    description: category.description,
    image: category.image,
    slug: category.slug,
    count: category.count
  }));

  // Combine all searchable items
  const allSearchableItems = [...allProducts, ...allCategories];

  // Search function
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase().trim();
      
      const results = allSearchableItems.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(normalizedQuery);
        const descriptionMatch = item.description?.toLowerCase().includes(normalizedQuery);
        
        return nameMatch || descriptionMatch;
      });

      // Sort results by relevance
      const sortedResults = results.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().startsWith(normalizedQuery) ? 2 : 
                          a.name.toLowerCase().includes(normalizedQuery) ? 1 : 0;
        const bNameMatch = b.name.toLowerCase().startsWith(normalizedQuery) ? 2 : 
                          b.name.toLowerCase().includes(normalizedQuery) ? 1 : 0;
        
        if (aNameMatch !== bNameMatch) return bNameMatch - aNameMatch;
        
        // Prioritize products over categories
        if (a.type === 'product' && b.type === 'category') return -1;
        if (a.type === 'category' && b.type === 'product') return 1;
        
        // For products, prioritize by rating
        if (a.type === 'product' && b.type === 'product') {
          return (b.rating || 0) - (a.rating || 0);
        }
        
        return 0;
      });

      setSearchResults(sortedResults.slice(0, 10)); // Limit to 10 results
      setShowResults(true);
      setIsSearching(false);
    }, 300);
  };

  // Handle search input change
  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery]);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when component opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search submission
  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm.trim()) {
      // Add to recent searches
      const updatedRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      setRecentSearches(updatedRecent);
      
      // Navigate to search results page or handle search
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-hidden">
          {/* Loading State */}
          {isSearching && (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Searching...</p>
            </div>
          )}

          {/* No Query State - Show suggestions */}
          {!searchQuery.trim() && !isSearching && (
            <div className="p-6">
              {/* Recent Searches */}
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

          {/* Search Results */}
          {searchQuery.trim() && !isSearching && (
            <div className="max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700">
                      Search Results ({searchResults.length})
                    </h3>
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
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
                        href={result.type === 'product' ? `/product/${result.id}` : `/category/${result.slug}`}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        onClick={() => {
                          setShowResults(false);
                          onClose?.();
                        }}
                      >
                        {/* Image */}
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={result.image}
                            alt={result.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="48px"
                          />
                        </div>
                        
                        {/* Content */}
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
                                  ${result.price}
                                </span>
                                {result.originalPrice && result.originalPrice > result.price! && (
                                  <span className="text-sm text-gray-400 line-through">
                                    ${result.originalPrice}
                                  </span>
                                )}
                                {result.rating && (
                                  <div className="flex items-center space-x-1">
                                    <Star size={12} className="text-yellow-400 fill-current" />
                                    <span className="text-xs text-gray-500">
                                      {result.rating} ({result.reviews})
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">
                                {result.count}
                              </span>
                            )}
                            
                            <span className="text-xs text-gray-400 capitalize">
                              {result.type}
                            </span>
                          </div>
                        </div>
                        
                        <ArrowRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
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
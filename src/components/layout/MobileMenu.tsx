'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, ChevronRight, User, Heart, ShoppingCart, Settings, LogOut, Grid, Zap, Star, Gift } from 'lucide-react';
import { AppSettings } from '@/settings/settings';


interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { name: 'Electronics', icon: Zap, count: 156 },
  { name: 'Fashion', icon: Star, count: 234 },
  { name: 'Home & Garden', icon: Grid, count: 89 },
  { name: 'Sports', icon: Gift, count: 67 }
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from your auth store

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Mobile Menu */}
      <div className="fixed top-0 left-0 w-80 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-900">{AppSettings.name}</h2>
                <p className="text-xs text-gray-500">{AppSettings.description}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Section */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">John Doe</h3>
                  <p className="text-sm text-gray-500">john@example.com</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link 
                  href="/login"
                  onClick={onClose}
                  className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register"
                  onClick={onClose}
                  className="block w-full border border-gray-300 text-gray-700 text-center py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Quick Actions */}
            <div className="p-4 space-y-3">
              <Link 
                href="/cart"
                onClick={onClose}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ShoppingCart size={20} className="text-blue-600" />
                  <span className="font-medium text-blue-900">Shopping Cart</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">3</span>
                  <ChevronRight size={16} className="text-blue-600" />
                </div>
              </Link>

              <Link 
                href="/wishlist"
                onClick={onClose}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Heart size={20} className="text-red-600" />
                  <span className="font-medium text-red-900">Wishlist</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">2</span>
                  <ChevronRight size={16} className="text-red-600" />
                </div>
              </Link>
            </div>

            {/* Main Navigation */}
            <div className="border-t border-gray-200">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Shop
                </h3>
                <nav className="space-y-1">
                  <Link 
                    href="/"
                    onClick={onClose}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">Home</span>
                  </Link>

                  <button 
                    onClick={() => setActiveSection(activeSection === 'categories' ? null : 'categories')}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">Categories</span>
                    <ChevronRight 
                      size={16} 
                      className={`transform transition-transform ${
                        activeSection === 'categories' ? 'rotate-90' : ''
                      }`} 
                    />
                  </button>

                  {activeSection === 'categories' && (
                    <div className="ml-4 space-y-1">
                      {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <Link 
                            key={category.name}
                            href={`/category/${category.name.toLowerCase()}`}
                            onClick={onClose}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <IconComponent size={18} className="text-gray-500" />
                              <span className="text-gray-700">{category.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">{category.count}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  <Link 
                    href="/products"
                    onClick={onClose}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">All Products</span>
                  </Link>

                  <Link 
                    href="/brands"
                    onClick={onClose}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">Brands</span>
                  </Link>
                </nav>
              </div>

              {/* Account Section */}
              {isLoggedIn && (
                <div className="border-t border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Account
                  </h3>
                  <nav className="space-y-1">
                    <Link 
                      href="/account"
                      onClick={onClose}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <User size={18} className="text-gray-500" />
                      <span className="text-gray-700">My Account</span>
                    </Link>

                    <Link 
                      href="/orders"
                      onClick={onClose}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Settings size={18} className="text-gray-500" />
                      <span className="text-gray-700">My Orders</span>
                    </Link>

                    <button 
                      onClick={() => {
                        setIsLoggedIn(false);
                        onClose();
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <LogOut size={18} className="text-gray-500" />
                      <span className="text-gray-700">Sign Out</span>
                    </button>
                  </nav>
                </div>
              )}

              {/* Help Section */}
              <div className="border-t border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Support
                </h3>
                <nav className="space-y-1">
                  <Link 
                    href="/help"
                    onClick={onClose}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-700">Help Center</span>
                  </Link>

                  <Link 
                    href="/contact"
                    onClick={onClose}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-700">Contact Us</span>
                  </Link>

                  <Link 
                    href="/track-order"
                    onClick={onClose}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-700">Track Order</span>
                  </Link>
                </nav>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <Link href="/privacy" onClick={onClose} className="hover:text-gray-900">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/terms" onClick={onClose} className="hover:text-gray-900">
                Terms
              </Link>
              <span>•</span>
              <span>{AppSettings.copyright}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
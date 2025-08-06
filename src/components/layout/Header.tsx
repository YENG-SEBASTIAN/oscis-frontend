'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, Heart, Bell } from 'lucide-react';
import SearchComponent from '../common/SearchComponent';
import { AppSettings } from '@/settings/settings';
import NotificationCenter from '../notification/Notification';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';


interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const router = useRouter();

  const { logout, user } = useAuthStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-6">
              <span>📞 Support: {AppSettings.contact.phone}</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/track-order" className="hover:text-gray-300 transition-colors">
                Track Order
              </Link>
              <Link href="/help" className="hover:text-gray-300 transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-black hover:bg-gray-100 transition-colors"
            onClick={onMobileMenuToggle}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-gray-900">{AppSettings.name}</h1>
              <p className="text-xs text-gray-500 -mt-1">{AppSettings.description}</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchComponent
              placeholder="Search products, brands, categories..."
              className="w-full"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button - Mobile */}
            <button
              className="md:hidden p-2 rounded-full text-blue-600 hover:bg-gray-100 transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors group">
              <Heart size={20} className="group-hover:text-red-500 text-red-400 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </Link>

            {/* Notifications */}
            <NotificationCenter />

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors group">
              <ShoppingCart size={20} className="group-hover:text-blue-600 text-blue-500 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <User size={20} className="text-black" />
                <span className="hidden lg:block text-sm font-medium text-black">Account</span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {user && (
                    <>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Wishlist
                      </Link>
                      <hr className="my-2" />
                    </>
                  )}

                  {!user ? (
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Sign In
                    </Link>
                  ) : (
                    <button
                      onClick={async () => {
                        await logout();
                        router.push('/login');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <SearchComponent
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              placeholder="Search products..."
              className="w-full"
            />
          </div>
        )}
      </div>
    </header>
  );
}
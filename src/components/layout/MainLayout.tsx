'use client';

import { useState } from 'react';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileMenu from './MobileMenu';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />

      {/* Navigation */}
      <Navbar />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

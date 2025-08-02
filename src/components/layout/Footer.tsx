import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard, Shield, Truck, RefreshCw } from 'lucide-react';
import { AppSettings } from '@/settings/settings';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className='w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden'>
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">{AppSettings.name}</h2>
                <p className="text-sm text-gray-400">{AppSettings.description}</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted destination. We offer quality items with exceptional customer service and fast shipping.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin size={16} className="text-blue-400" />
                <span className="text-gray-400">{AppSettings.contact.address}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone size={16} className="text-blue-400" />
                <span className="text-gray-400">{AppSettings.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail size={16} className="text-blue-400" />
                <span className="text-gray-400">{AppSettings.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-400 hover:text-white transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-400 hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-400 hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to get special offers, updates and more.
            </p>

            {/* Newsletter Form */}
            <div className="mb-6">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <button className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors font-medium">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                By subscribing, you agree to our Privacy Policy
              </p>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm font-medium mb-3">Follow Us</p>
              <div className="flex space-x-4">
                <a href={AppSettings.socialLinks.facebook} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href={AppSettings.socialLinks.twitter} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href={AppSettings.socialLinks.instagram} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href={AppSettings.socialLinks.youtube} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                {AppSettings.copyright}. |
                <Link href="/privacy" className="hover:text-white ml-1">Privacy Policy</Link> |
                <Link href="/terms" className="hover:text-white ml-1">Terms of Service</Link>
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">We Accept:</span>
              <div className="flex items-center space-x-2">
                <div
                  className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center"
                  title={AppSettings.paymentMethods.visa}
                >
                  <CreditCard size={14} className="text-white" />
                </div>
                <div
                  className="w-10 h-6 bg-red-600 rounded flex items-center justify-center"
                  title={AppSettings.paymentMethods.mastercard}
                >
                  <CreditCard size={14} className="text-white" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
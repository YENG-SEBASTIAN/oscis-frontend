'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AppSettings } from '@/settings/settings';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white px-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Error Code */}
      <motion.h1
        className="text-[100px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-lg mb-4"
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        404
      </motion.h1>

      {/* Error Message */}
      <motion.h2
        className="text-5xl md:text-6xl font-semibold text-gray-700 mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Oops! Lost in the Shop
      </motion.h2>

      <p className="text-lg text-gray-500 max-w-xl mt-2 mb-8">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      {/* Go Home Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/"
          className="relative inline-block px-8 py-3 font-medium text-white bg-blue-600 rounded-full transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <span className="absolute inset-0 rounded-full bg-white opacity-10 blur-lg animate-pulse"></span>
          Go to Homepage
        </Link>
      </motion.div>

      {/* Redirect Notice */}
      <motion.p
        className="mt-6 text-sm text-gray-500 animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Redirecting in 5 seconds...
      </motion.p>

      {/* App Footer Info */}
      <p className="mt-2 text-xs text-gray-400">{AppSettings.name}</p>
    </motion.div>
  );
}

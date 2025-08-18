'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CODSuccessPageProps {
  orderNumber?: string | null;
}

export default function CODSuccessPage({ orderNumber }: CODSuccessPageProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center"
      >
        <CheckCircle className="w-16 h-16 text-blue-600 mb-6 animate-bounce" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-4">
          Thank you! Your order <span className="font-semibold">{orderNumber}</span> has been placed successfully.
        </p>
        <p className="text-md md:text-lg text-gray-600 mb-6 px-4">
          <span className="font-medium text-blue-700">Please prepare cash</span> for delivery. Our delivery team will contact you shortly.
        </p>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
          <motion.div
            className="bg-blue-600 h-2"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        </div>
        <p className="text-gray-500 mb-6">{countdown} second{countdown > 1 ? 's' : ''} remaining</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
        >
          Go to Home
        </motion.button>
      </motion.div>
    </div>
  );
}

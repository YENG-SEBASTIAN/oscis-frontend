'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePaymentStore } from '@/store/usePaymentStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type PaymentStatus = 'succeeded' | 'processing' | 'requires_payment_method' | 'unknown';

export default function PaymentSuccessPage() {
  const { verifyPayment } = usePaymentStore();
  const [status, setStatus] = useState<PaymentStatus>('unknown');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const order = params.get('order');

    if (!order) {
      toast.error('Missing order number');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await verifyPayment(order);
        setStatus(data.status as PaymentStatus);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Failed to verify payment');
        setStatus('unknown');
      } finally {
        setLoading(false);
      }
    })();
  }, [verifyPayment]);

  const messages: Record<PaymentStatus, { title: string; description: string; color: string; icon?: any }> = {
    succeeded: {
      title: 'Payment Successful! 🎉',
      description: 'Thank you! Your order is confirmed. Keep shopping and explore more products.',
      color: 'text-green-600',
      icon: CheckCircle,
    },
    processing: {
      title: 'Payment Processing…',
      description: 'We are confirming your payment. Please wait.',
      color: 'text-blue-600',
      icon: Loader2,
    },
    requires_payment_method: {
      title: 'Payment Failed',
      description: 'Payment could not be completed. Please try another payment method.',
      color: 'text-rose-600',
      icon: AlertCircle,
    },
    unknown: {
      title: 'Verifying Payment…',
      description: 'We are checking your payment. Please wait.',
      color: 'text-gray-800',
      icon: Loader2,
    },
  };

  const { title, description, color, icon: Icon } = messages[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg text-center"
      >
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-700 text-lg">Checking your payment…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {Icon && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              >
                <Icon className={`w-12 h-12 ${color}`} />
              </motion.div>
            )}
            <h1 className={`text-2xl font-bold ${color}`}>{title}</h1>
            <p className="text-gray-700">{description}</p>

            {status === 'succeeded' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/')}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
              >
                Keep Shopping
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

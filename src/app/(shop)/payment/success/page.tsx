'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import { usePaymentStore, PaymentItem } from '@/store/usePaymentStore';

type PaymentStatus = 'succeeded' | 'processing' | 'requires_payment_method' | 'awaiting_payment' | 'unknown';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { verifyPaymentByOrderId, retryStripePayment } = usePaymentStore();
  const [payment, setPayment] = useState<PaymentItem | null>(null);
  const [status, setStatus] = useState<PaymentStatus>('unknown');
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderNumber = params.get('order');

    if (!orderNumber) {
      toast.error('Missing order number');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await verifyPaymentByOrderId(orderNumber);
        setPayment(data);

        // Determine frontend status
        switch (data.payment_status) {
          case 'Success':
            setStatus('succeeded');
            break;
          case 'Awaiting_Payment': // COD
            setStatus('awaiting_payment');
            break;
          case 'Failed':
            setStatus('requires_payment_method');
            break;
          default:
            setStatus('processing');
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Failed to verify payment');
        setStatus('unknown');
      } finally {
        setLoading(false);
      }
    })();
  }, [verifyPaymentByOrderId]);

  const handleRetry = async () => {
    if (!payment) return;
    setRetrying(true);
    try {
      const data = await retryStripePayment(payment.order_number);
      toast.success('Retry initialized. Complete your card payment below.');
      // redirect to checkout page with retry info
      router.push(`/checkout?order=${payment.order_number}&retry=true`);
    } catch (err: any) {
      toast.error(err.message || 'Retry failed');
    } finally {
      setRetrying(false);
    }
  };

  const messages: Record<PaymentStatus, { title: string; description: string; color: string; icon?: any }> = {
    succeeded: {
      title: 'Payment Successful! 🎉',
      description: 'Thank you! Your order is confirmed.',
      color: 'text-green-600',
      icon: CheckCircle,
    },
    awaiting_payment: {
      title: 'Order Confirmed (COD)',
      description: 'Your order has been placed. Please prepare cash for delivery.',
      color: 'text-blue-600',
      icon: CheckCircle,
    },
    requires_payment_method: {
      title: 'Payment Failed',
      description: 'Payment could not be completed. Retry your card payment.',
      color: 'text-rose-600',
      icon: AlertCircle,
    },
    processing: {
      title: 'Payment Processing…',
      description: 'We are confirming your payment. Please wait.',
      color: 'text-blue-600',
      icon: Loader2,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
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
            {Icon && <Icon className={`w-12 h-12 ${color}`} />}
            <h1 className={`text-2xl font-bold ${color}`}>{title}</h1>
            <p className="text-gray-700">{description}</p>

            {/* Retry button for failed CARD payments */}
            {status === 'requires_payment_method' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetry}
                disabled={retrying}
                className="mt-4 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
              >
                {retrying ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
                {retrying ? 'Retrying…' : 'Retry Payment'}
              </motion.button>
            )}

            {/* Continue shopping button for COD or successful CARD */}
            {(status === 'succeeded' || status === 'awaiting_payment') && (
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

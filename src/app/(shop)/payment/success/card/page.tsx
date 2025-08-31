'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import { usePaymentStore, PaymentItem } from '@/store/usePaymentStore';

type PaymentStatus = 'succeeded' | 'processing' | 'requires_payment_method' | 'unknown';

export default function CardSuccessPage() {
  const router = useRouter();
  const { verifyPaymentByOrderId, retryStripePayment } = usePaymentStore();
  const [payment, setPayment] = useState<PaymentItem | null>(null);
  const [status, setStatus] = useState<PaymentStatus>('unknown');
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  // -----------------------------
  // Fetch payment status on mount
  // -----------------------------
  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const orderNumber = params.get('order');

        if (!orderNumber) throw new Error('Missing order number');

        const paymentData = await verifyPaymentByOrderId(orderNumber);
        setPayment(paymentData);

        // Map backend status to frontend status
        switch (paymentData.status) {
          case 'Success':
            setStatus('succeeded');
            break;
          case 'Failed':
            setStatus('requires_payment_method');
            break;
          case 'Pending':
          case 'Processing':
            setStatus('processing');
            break;
          default:
            setStatus('unknown');
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to verify payment');
        setStatus('unknown');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [verifyPaymentByOrderId]);

  // -----------------------------
  // Retry payment if failed
  // -----------------------------
  const handleRetry = async () => {
    if (!payment) return;

    setRetrying(true);
    try {
      await retryStripePayment(payment.order_number);
      toast.success('Retry initialized. Complete your card payment again.');
      router.push(`/checkout?order=${payment.order_number}&retry=true`);
    } catch (err: any) {
      toast.error(err.message || 'Retry failed');
    } finally {
      setRetrying(false);
    }
  };

  // -----------------------------
  // Status messages config
  // -----------------------------
  const messages: Record<PaymentStatus, { title: string; description: string; color: string; icon?: any }> = {
    succeeded: {
      title: 'Payment Successful! 🎉',
      description: 'Thank you! Your order is confirmed. You will receive an email confirmation shortly.',
      color: 'text-green-600',
      icon: CheckCircle,
    },
    requires_payment_method: {
      title: 'Payment Failed',
      description: 'Payment could not be completed. Please retry your card payment.',
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
      description: 'Checking your payment status. Please wait.',
      color: 'text-gray-800',
      icon: Loader2,
    },
  };

  const { title, description, color, icon: Icon } = messages[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center"
      >
        {loading ? (
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-gray-700">Checking your payment…</p>
          </div>
        ) : (
          <>
            {Icon && <Icon className={`w-16 h-16 mb-6 ${color}`} />}
            <h1 className={`text-3xl font-extrabold ${color} mb-4`}>{title}</h1>
            <p className="text-gray-700 mb-6">{description}</p>

            {status === 'requires_payment_method' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetry}
                disabled={retrying}
                className="flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
              >
                {retrying ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
                {retrying ? 'Retrying…' : 'Retry Payment'}
              </motion.button>
            )}

            {status === 'succeeded' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/')}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg"
              >
                Keep Shopping
              </motion.button>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

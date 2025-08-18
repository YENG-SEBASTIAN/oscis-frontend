'use client';

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, Lock, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useOrderStore } from '@/store/useOrderStore';

interface PaymentFormProps {
  clientSecret: string;
  orderId: string;
  paymentMethod: 'COD' | 'CARD';
  onSuccess?: () => void;
}

export default function PaymentForm({ clientSecret, orderId, paymentMethod, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { retryPayment } = useOrderStore();

  const [submitting, setSubmitting] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  // Reset form state when clientSecret changes
  useEffect(() => {
    setFormReady(false);
    setErrorMessage(null);
    setLoading(true);
  }, [clientSecret]);

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !formReady) {
      toast.error('Payment form is not ready.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success/card?order=${orderId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        const retry = confirm('Payment failed. Retry your card payment?');
        if (retry) await handleRetry();
        else setErrorMessage(error.message || 'Payment failed. Try again.');
        return;
      }

      if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
        toast.success('Payment successful!');
        onSuccess?.();
        window.location.href = `/payment/success/card?order=${orderId}`;
      }
    } catch (err: any) {
      toast.error(err?.message || 'Unexpected error during payment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    setErrorMessage(null);
    try {
      const { client_secret } = await retryPayment(orderId);
      toast.success('Retry initialized. Complete your card payment below.');
      setFormReady(false);
      setLoading(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Retry failed.');
      toast.error(err?.message || 'Retry failed.');
    } finally {
      setRetrying(false);
    }
  };

  if (!clientSecret) {
    return (
      <p className="text-gray-500 text-sm bg-gray-50 border p-4 rounded-lg">
        Unable to initialize card payment. Please try again later.
      </p>
    );
  }

  return (
    <form onSubmit={handleStripeSubmit} className="space-y-6 mt-6">
      {loading && (
        <div className="flex flex-col items-center justify-center gap-2 p-6 bg-gray-50 border rounded-lg">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading payment form…</p>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className={`border rounded-lg p-4 bg-gray-50 ${loading ? 'hidden' : 'block'}`}>
        <PaymentElement
          options={{ layout: 'tabs' }}
          onReady={() => {
            setFormReady(true);
            setLoading(false);
          }}
          onChange={(e) => setErrorMessage(e.error?.message ?? null)}
          onLoadError={(err: Error) => setErrorMessage(err.message)}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || submitting || !formReady || retrying || loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-md disabled:opacity-60"
      >
        {submitting || retrying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
        {submitting ? 'Processing…' : retrying ? 'Retrying…' : 'Pay Securely'}
      </button>
    </form>
  );
}

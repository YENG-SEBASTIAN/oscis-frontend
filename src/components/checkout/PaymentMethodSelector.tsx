'use client';

import { Truck, CreditCard, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const CardCheckout = dynamic(() => import('./CardCheckout'), { ssr: false });

interface StepCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function StepCard({ selected, onClick, icon, label }: StepCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full border rounded-xl p-6 flex flex-col items-center gap-2 transition shadow-sm hover:shadow-md
        ${selected ? 'border-blue-600 ring-2 ring-blue-200 bg-blue-50' : 'border-gray-200 bg-white'}`}
    >
      {icon}
      <p className="font-medium text-gray-800">{label}</p>
    </button>
  );
}

interface Props {
  selectedAddress: string | null;
  paymentMethod: 'COD' | 'CARD' | null;
  setPaymentMethod: (method: 'COD' | 'CARD') => void;
  orderId: string | null;
  clientSecret: string | null;
  onCheckout: (method: 'COD' | 'CARD') => void;
  checkoutLoading: boolean;
}

export default function PaymentMethodSelector({
  selectedAddress,
  paymentMethod,
  setPaymentMethod,
  orderId,
  clientSecret,
  onCheckout,
  checkoutLoading,
}: Props) {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Payment Method</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <StepCard
          selected={paymentMethod === 'COD'}
          onClick={() => setPaymentMethod('COD')}
          icon={<Truck className="w-8 h-8 text-blue-600" />}
          label="Cash on Delivery"
        />
        <StepCard
          selected={paymentMethod === 'CARD'}
          onClick={() => setPaymentMethod('CARD')}
          icon={<CreditCard className="w-8 h-8 text-blue-600" />}
          label="Pre-pay with Card"
        />
      </div>

      {paymentMethod && selectedAddress && (!orderId || paymentMethod === 'CARD') && (
        <button
          onClick={() => onCheckout(paymentMethod)}
          disabled={checkoutLoading || (paymentMethod === 'CARD' && clientSecret !== null)}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {checkoutLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Processing...
            </>
          ) : paymentMethod === 'COD' ? 'Place Order (COD)' : 'Proceed to Payment'}
        </button>
      )}

      {paymentMethod === 'CARD' && orderId && clientSecret && (
        <div className="mt-6">
          <CardCheckout clientSecret={clientSecret} orderId={orderId} />
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useCartStore } from '@/store/useCartStore';
import { useAddressStore } from '@/store/addressStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useUserStore } from '@/store/useUserStore';

import AddressSelector from '@/components/checkout/AddressSelector';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import OrderSummary from '@/components/checkout/OrderSummary';

export default function CheckoutPage() {
  const router = useRouter();

  const { fetchCart } = useCartStore();
  const { fetchAddresses } = useAddressStore();
  const { checkout } = useOrderStore();
  const { fetchUser } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD' | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchCart(), fetchAddresses(), fetchUser()]);
      } catch {
        toast.error('Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle COD and CARD checkout
  const handleCheckout = async (method: 'COD' | 'CARD') => {
    if (!selectedAddress) return toast.error('Please select a delivery address');
    setCheckoutLoading(true);
    try {
      const order = await checkout({ address: selectedAddress, payment_method: method });
      if (!order) throw new Error('Failed to create order');

      setOrderId(order.order_number);

      if (method === 'COD') {
        toast.success('Order placed successfully with Cash on Delivery.');
        router.push(`/payment/success/cod?order=${order.order_number}`);
      } else if (method === 'CARD') {
        if (!order.client_secret) throw new Error('Failed to initialize card payment');
        setClientSecret(order.client_secret);
        toast.success('Order created. Complete your card payment below.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Checkout failed.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      {/* Mobile: Order Summary on top */}
      <div className="lg:hidden mb-6">
        <OrderSummary />
      </div>

      {/* Left Section */}
      <section className="lg:col-span-2 space-y-10">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Delivery Address</h2>
          <AddressSelector
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        </div>

        <PaymentMethodSelector
          selectedAddress={selectedAddress}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          orderId={orderId}
          clientSecret={clientSecret}
          onCheckout={handleCheckout}
          checkoutLoading={checkoutLoading}
        />
      </section>

      {/* Right Section: Desktop */}
      <aside className="hidden lg:block">
        <OrderSummary />
      </aside>
    </div>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import { useCartStore } from '@/store/useCartStore';
import { useAddressStore } from '@/store/addressStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useUserStore } from '@/store/useUserStore';

import AddressSelector from '@/components/checkout/AddressSelector';
import PaymentMethodSelector, { PaymentMethod } from '@/components/checkout/PaymentMethodSelector';
import OrderSummary from '@/components/checkout/OrderSummary';
import { AddressFormData } from '@/components/checkout/CheckoutAddress';
import { PaymentFormProps } from '@/components/checkout/PaymentForm';

export default function CheckoutPage() {
  // -------------------------
  // Stores
  // -------------------------
  const { fetchCart } = useCartStore();
  const { fetchAddresses, createAddress } = useAddressStore();
  const { checkout } = useOrderStore();
  const { fetchUser } = useUserStore();

  // -------------------------
  // Local state
  // -------------------------
  const [loading, setLoading] = useState(true);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [newAddressData, setNewAddressData] = useState<AddressFormData | null>(null);
  const [checkoutData, setCheckoutData] = useState<PaymentFormProps | null>(null);

  // -------------------------
  // Load initial data
  // -------------------------
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
  }, [fetchCart, fetchAddresses, fetchUser]);

  // -------------------------
  // Handle address change
  // -------------------------
  const handleAddressChange = useCallback((selectedId: string | null, newAddress: AddressFormData | null) => {
    setAddressId(selectedId);
    setNewAddressData(newAddress);
    setCheckoutData(null); // reset when address changes
  }, []);

  const hasValidAddress = Boolean(addressId || newAddressData);

  // -------------------------
  // Checkout flow
  // -------------------------
  const handleCheckout = useCallback(
    async (method?: PaymentMethod) => {
      let finalAddressId = addressId;

      // 1. If user filled new address form, create it first
      if (!finalAddressId && newAddressData) {
        try {
          const created = await createAddress(newAddressData);
          finalAddressId = created.id;
          setAddressId(created.id);
        } catch {
          toast.error('Failed to save address');
          return null;
        }
      }

      if (!finalAddressId) {
        toast.error('Please select or provide a valid address');
        return null;
      }

      try {

        const order = await checkout({
          address: finalAddressId,
          payment_method: method
        });

        if (!order?.order_number || !order.client_secret || !order.customer_details) {
          throw new Error('Failed to create order');
        }

        const data = { orderId: order.order_number, clientSecret: order.client_secret, customer_details: order.customer_details };
        setCheckoutData(data);
        return data;
      } catch (err: any) {
        toast.error(err.message || 'Checkout failed');
        return null;
      }
    },
    [addressId, newAddressData, checkout, createAddress]
  );

  // -------------------------
  // Render
  // -------------------------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Mobile Order Summary */}
        <div className="lg:hidden">
          <OrderSummary />
        </div>

        {/* Main Checkout Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Address */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">1. Delivery Address</h2>
            <AddressSelector onAddressChange={handleAddressChange} />
          </section>

          {/* Step 2: Payment */}
          {hasValidAddress && (
            <section>
              <PaymentMethodSelector hasValidAddress={hasValidAddress} onCheckout={handleCheckout} />
            </section>
          )}
        </div>

        {/* Desktop Order Summary */}
        <aside className="hidden lg:block">
          <OrderSummary />
        </aside>
      </div>
    </div>
  );
}

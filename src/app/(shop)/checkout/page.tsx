"use client";

import { useEffect, useState, useMemo } from "react";
import { Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useCartStore } from "@/store/useCartStore";
import { useAddressStore } from "@/store/addressStore";
import { useOrderStore } from "@/store/useOrderStore";

export default function CheckoutPage() {
  const router = useRouter();

  // Zustand stores
  const { items, fetchCart } = useCartStore();
  const { addresses, fetchAddresses } = useAddressStore();
  const { checkout, loading: checkoutLoading } = useOrderStore();

  // Local state
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Totals
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const total = subtotal; // tax/shipping can be added later

  // Fetch cart + addresses on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchCart(), fetchAddresses()]);
      } catch {
        toast.error("Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchCart, fetchAddresses]);

  // Handle checkout
  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      const order = await checkout({ address: selectedAddress });

      if (!order) {
        toast.error("Checkout failed - no order returned");
        return;
      }

      // ✅ Debug logs
      console.log("✅ Order created:", order.order_number);
      console.log("💳 Payment Intent:", order.payment_intent_id);
      console.log("🔑 Client secret:", order.client_secret);

      // Clear old session
      sessionStorage.removeItem("order_id");
      sessionStorage.removeItem("stripe_client_secret");

      // Save new session
      sessionStorage.setItem("order_id", order.order_number);
      if (order.client_secret) {
        sessionStorage.setItem("stripe_client_secret", order.client_secret);

        // Small delay ensures session is written before redirect
        await new Promise((resolve) => setTimeout(resolve, 100));

        router.push("/payment");
      } else {
        toast.error("Payment initialization failed - missing client secret");
      }
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
    }
  };

  // --- UI states ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
        <span className="ml-2 text-gray-600">Loading checkout...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <div className="rounded-2xl border bg-white shadow p-8 text-center">
          <p className="text-lg font-semibold text-gray-800 mb-2">
            Your cart is empty
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Add some items to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // --- Main checkout layout ---
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Delivery Address */}
      <section className="md:col-span-2 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Select Delivery Address
        </h2>

        {addresses.length === 0 ? (
          <p className="text-gray-500 text-sm bg-gray-50 border p-4 rounded-lg">
            No saved addresses found. Please add one in your account settings.
          </p>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => setSelectedAddress(addr.id)}
                className={`w-full text-left relative border rounded-xl p-5 transition shadow-sm hover:shadow-md
                  ${
                    selectedAddress === addr.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {addr.address_line1}
                    </p>
                    <p className="text-sm text-gray-600">
                      {addr.city}, {addr.country}
                    </p>
                  </div>
                </div>
                {selectedAddress === addr.id && (
                  <span className="absolute top-3 right-3 text-xs bg-blue-600 text-white px-2 py-1 rounded-md">
                    Selected
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Order Summary */}
      <aside className="bg-white p-6 rounded-2xl shadow-lg space-y-5 border">
        <h2 className="text-2xl font-semibold text-gray-800">Order Summary</h2>

        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between py-3 text-sm text-gray-700"
            >
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-600">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-gray-900 border-t pt-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={checkoutLoading || !selectedAddress}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {checkoutLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Payment"
          )}
        </button>
      </aside>
    </div>
  );
}

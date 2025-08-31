"use client";

import { useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { Loader2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

interface ClearpayCheckoutProps {
  clientSecret: string;
  orderId: string;
}

export default function ClearpayCheckout({ clientSecret, orderId }: ClearpayCheckoutProps) {
  const stripe = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClearpay = async () => {
    if (!stripe) return;

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmAfterpayClearpayPayment(clientSecret, {
        return_url: `${window.location.origin}/payment/success/?order=${orderId}/`,
      });

      if (error) {
        toast.error(error.message || "Clearpay payment failed");
      }
    } catch (err: any) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleClearpay}
      disabled={!stripe || isProcessing}
      className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition"
    >
      {isProcessing ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ShoppingBag className="w-5 h-5" />
      )}
      {isProcessing ? "Processing..." : "Pay with Clearpay"}
    </button>
  );
}
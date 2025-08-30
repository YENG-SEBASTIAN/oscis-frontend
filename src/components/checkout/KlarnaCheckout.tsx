"use client";

import { useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { Loader2, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

interface KlarnaCheckoutProps {
  clientSecret: string;
  orderId: string;
}

export default function KlarnaCheckout({ clientSecret, orderId }: KlarnaCheckoutProps) {
  const stripe = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleKlarna = async () => {
    if (!stripe) return;

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmKlarnaPayment(clientSecret, {
        return_url: `${window.location.origin}/payment/success/?order=${orderId}`,
      });

      if (error) {
        toast.error(error.message || "Klarna payment failed");
      }
    } catch (err: any) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleKlarna}
      disabled={!stripe || isProcessing}
      className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition"
    >
      {isProcessing ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <CreditCard className="w-5 h-5" />
      )}
      {isProcessing ? "Processing..." : "Pay with Klarna"}
    </button>
  );
}

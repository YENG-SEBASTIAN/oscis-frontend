"use client";

import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, Apple, Smartphone } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  clientSecret: string;
  orderId: string;
  method: "apple_pay" | "google_pay";
}

export default function DigitalWalletCheckout({ clientSecret, orderId, method }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success/?order=${orderId}`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || `${method.replace("_", " ")} payment failed`);
      } else if (paymentIntent?.status === "succeeded") {
        toast.success("Payment successful!");
        window.location.href = `/payment/success/?order=${orderId}`;
      }
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const Icon = method === "apple_pay" ? Apple : Smartphone;

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={!stripe || !elements || isProcessing}
      className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition"
    >
      {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
      {isProcessing
        ? "Processing..."
        : `Pay with ${method.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}`}
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import { PaymentFormProps } from "./PaymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);


export default function CardCheckout({ clientSecret, orderId, customer_details }: PaymentFormProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-6 border rounded-lg bg-gray-50 text-gray-600">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Preparing secure payment...</span>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm clientSecret={clientSecret} orderId={orderId} customer_details={customer_details} />
    </Elements>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  loadStripe,
  type StripePaymentElementChangeEvent,
} from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { Loader2, Lock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentPage() {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Load clientSecret from sessionStorage (set after order creation)
  useEffect(() => {
    const secret = sessionStorage.getItem("stripe_client_secret");
    if (!secret) {
      toast.error("Missing payment session. Please go back to checkout.");
      router.push("/cart");
    }
    setClientSecret(secret);
  }, []);

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <p className="text-red-600 font-medium">
        ⚠️ Missing Stripe publishable key in <code>.env</code>
      </p>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Preparing payment…</span>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6 text-blue-500">
        Secure Payment
      </h1>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: { theme: "flat" },
        }}
      >
        <PaymentForm />
      </Elements>
    </div>
  );
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [submitting, setSubmitting] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const orderId =
    typeof window !== "undefined"
      ? sessionStorage.getItem("order_id") || ""
      : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !formReady) {
      toast.error("Payment form is not ready yet.");
      return;
    }

    setSubmitting(true);
    try {
      // Validate inputs before submitting
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(submitError.message || "Check your card details.");
        return;
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?order=${orderId}`,
        },
      });

      if (error) {
        toast.error(error.message || "Payment failed. Try again.");
        return;
      }

      // If no redirect, check status manually
      if (
        paymentIntent?.status === "succeeded" ||
        paymentIntent?.status === "processing"
      ) {
        window.location.replace(`/payment/success?order=${orderId}`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Unexpected error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error banner */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Stripe Payment Element */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card"],
            fields: {
              billingDetails: { name: "auto", email: "auto", address: "auto" },
            },
          }}
          onReady={() => setFormReady(true)}
          onChange={(e: StripePaymentElementChangeEvent) =>
            setErrorMessage(e.error?.message ?? null)
          }
          onLoadError={(err: Error) => setErrorMessage(err.message)}
        />
      </div>

      {/* Pay button */}
      <button
        type="submit"
        disabled={!stripe || !elements || submitting || !formReady}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-md disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Lock className="w-5 h-5" />
        )}
        {submitting ? "Processing…" : "Pay Securely"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        🔒 Payments are processed securely by Stripe. Your card details are
        never stored on our servers.
      </p>
    </form>
  );
}

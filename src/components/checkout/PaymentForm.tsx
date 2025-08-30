"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";
import type { 
  StripeError,
  StripePaymentElementChangeEvent 
} from "@stripe/stripe-js";

export interface CustomerDetails {
  name: string;
  email: string;
}

export interface PaymentFormProps {
  clientSecret: string;
  orderId: string;
  customer_details: CustomerDetails;
}

export default function PaymentForm({ clientSecret, orderId, customer_details }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePaymentElementReady = () => {
    setIsFormReady(true);
    setErrorMessage(null);
  };

  const handlePaymentElementChange = (event: StripePaymentElementChangeEvent) => {
    setIsFormComplete(event.complete);
    
    // Clear any previous errors when user starts interacting
    if (errorMessage && !event.empty) {
      setErrorMessage(null);
    }
  };

  const handleLoadError = (event: { elementType: "payment"; error: StripeError }) => {
    const errorMsg = event.error.message || "Failed to load payment form";
    setErrorMessage(errorMsg);
    toast.error(errorMsg);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!stripe || !elements || !isFormReady) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success/?order=${orderId}`,
          payment_method_data: {
            billing_details: {
              name: customer_details.name,
              email: customer_details.email,
              phone: null,
              address: {
                country: null,
                postal_code: null,
                state: null,
                city: null,
                line1: null,
                line2: null,
              },
            },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        const errorMsg = error.message || "Payment processing failed";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      } else if (paymentIntent?.status === "succeeded") {
        toast.success("Payment completed successfully!");
        window.location.href = `/payment/success/?order=${orderId}`;
      } else if (paymentIntent?.status === "processing") {
        toast.loading("Payment is being processed...");
      }
    } catch (err) {
      const fallbackMsg = "An unexpected error occurred. Please try again.";
      setErrorMessage(fallbackMsg);
      toast.error(fallbackMsg);
      console.error("Payment confirmation error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-lg p-4 bg-gray-50">
        {!isFormReady && (
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading payment form...</span>
          </div>
        )}

        <PaymentElement
          options={{
            layout: "tabs",
            fields: {
              billingDetails: {
                name: "never",
                email: "never",
                phone: "never",
                address: {
                  country: "never",
                  postalCode: "never",
                  state: "never",
                  city: "never",
                  line1: "never",
                  line2: "never",
                },
              },
            },
            terms: {
              card: "never",
              applePay: "never",
              googlePay: "never",
              paypal: "never",
              auBecsDebit: "never",
              bancontact: "never",
              cashapp: "never",
              ideal: "never",
              sepaDebit: "never",
              sofort: "never",
              usBankAccount: "never",
            },
            wallets: {
              applePay: "auto",
              googlePay: "auto",
              link: "never",
            },
          }}
          onReady={handlePaymentElementReady}
          onChange={handlePaymentElementChange}
          onLoadError={handleLoadError}
        />

        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!stripe || !isFormReady || isProcessing}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition"
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Lock className="w-5 h-5" />
        )}
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
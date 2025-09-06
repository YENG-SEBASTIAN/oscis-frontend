"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Loader2,
  Lock,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import type {
  StripeError,
  StripePaymentElementChangeEvent,
} from "@stripe/stripe-js";
import WalletPayment from "./WalletPayment";

export interface CustomerDetails {
  name: string;
  email: string;
}

export interface PaymentFormProps {
  clientSecret: string;
  orderId: string;
  customer_details: CustomerDetails;
}

export default function PaymentForm({
  clientSecret,
  orderId,
  customer_details,
}: PaymentFormProps) {
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

  const handlePaymentElementChange = (
    event: StripePaymentElementChangeEvent
  ) => {
    setIsFormComplete(event.complete);

    if (errorMessage && !event.empty) {
      setErrorMessage(null);
    }
  };

  const handleLoadError = (event: {
    elementType: "payment";
    error: StripeError;
  }) => {
    const errorMsg = event.error.message || "Failed to load payment form";
    setErrorMessage(errorMsg);
    toast.error(errorMsg);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements || !isFormReady) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success/?order=${orderId}`,
          payment_method_data: {
            billing_details: {
              name: customer_details.name || "Customer",
              email: customer_details.email || null,
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
        toast.loading("Payment is being processed...", { duration: 5000 });
        setTimeout(() => {
          window.location.href = `/payment/success/?order=${orderId}`;
        }, 2000);
      } else if (paymentIntent?.status === "requires_action") {
        toast.error("Please complete the additional verification step.");
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
    <div className="space-y-6">
      {/* Wallet Payment Section */}
      <WalletPayment clientSecret={clientSecret} orderId={orderId} />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or pay with card</span>
        </div>
      </div>

      {/* Card Payment Form */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Card Payment</h3>
            <p className="text-sm text-gray-600">Enter your card details below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm relative">
            {!isFormReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading payment form...</span>
                </div>
              </div>
            )}

            <PaymentElement
              onReady={handlePaymentElementReady}
              onChange={handlePaymentElementChange}
              onLoadError={handleLoadError}
              options={{
                layout: "tabs",
                fields: {
                  billingDetails: "auto",
                },
              }}
            />

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!stripe || !isFormReady || isProcessing || !isFormComplete}
            className={`
              w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200
              ${!stripe || !isFormReady || isProcessing || !isFormComplete
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }
            `}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Complete Payment</span>
              </>
            )}
          </button>

          {/* Trust Indicators */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Lock className="w-2 h-2 text-green-600" />
                </div>
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span>Trusted by millions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <span>Your data is protected</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
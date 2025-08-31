"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, Lock, Smartphone, CreditCard } from "lucide-react";
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
  const [paymentMethodType, setPaymentMethodType] = useState<string>("");

  const handlePaymentElementReady = () => {
    setIsFormReady(true);
    setErrorMessage(null);
  };

  const handlePaymentElementChange = (event: StripePaymentElementChangeEvent) => {
    setIsFormComplete(event.complete);
    setPaymentMethodType(event.value.type || "");
    
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

  const getPaymentIcon = () => {
    switch (paymentMethodType) {
      case "apple_pay":
        return <Smartphone className="w-5 h-5" />;
      case "google_pay":
        return <Smartphone className="w-5 h-5" />;
      case "card":
      default:
        return <Lock className="w-5 h-5" />;
    }
  };

  const getButtonText = () => {
    if (isProcessing) return "Processing...";
    
    switch (paymentMethodType) {
      case "apple_pay":
        return "Pay with Apple Pay";
      case "google_pay":
        return "Pay with Google Pay";
      case "card":
        return "Pay with Card";
      default:
        return "Complete Payment";
    }
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
              name: customer_details.name || "Customer",
              email: customer_details.email || null,
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
    <div className="space-y-4">
      {/* Payment Method Indicator */}
      {isFormReady && paymentMethodType && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-md">
          {paymentMethodType === "apple_pay" && (
            <>
              <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">
                
              </div>
              <span>Apple Pay selected</span>
            </>
          )}
          {paymentMethodType === "google_pay" && (
            <>
              <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                G
              </div>
              <span>Google Pay selected</span>
            </>
          )}
          {paymentMethodType === "card" && (
            <>
              <CreditCard className="w-4 h-4" />
              <span>Card payment selected</span>
            </>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border rounded-lg p-4 bg-gray-50 relative">
          {!isFormReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading payment options...</span>
              </div>
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
                applePay: "auto", // Shows on Safari/iOS when available
                googlePay: "auto", // Shows on Chrome/Android when available
                link: "never", // Keeps "Save for faster checkout" disabled
              },
              // Optional: Customize wallet appearance
              // applePay: {
              //   buttonType: "pay",
              //   buttonStyle: "black"
              // }
            }}
            onReady={handlePaymentElementReady}
            onChange={handlePaymentElementChange}
            onLoadError={handleLoadError}
          />

          {errorMessage && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{errorMessage}</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!stripe || !isFormReady || isProcessing}
          className={`
            w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200
            ${(!stripe || !isFormReady || isProcessing)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow"
            }
          `}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              {getPaymentIcon()}
              <span>{getButtonText()}</span>
            </>
          )}
        </button>

        {/* Security Notice */}
        <div className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </form>
    </div>
  );
}
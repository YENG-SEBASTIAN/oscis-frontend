"use client";

import { ExpressCheckoutElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import type { StripeExpressCheckoutElementOptions } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { Smartphone, Zap } from "lucide-react";

interface WalletPaymentProps {
  clientSecret: string;
  orderId: string;
}

export default function WalletPayment({ clientSecret, orderId }: WalletPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();

  const expressOptions: StripeExpressCheckoutElementOptions = {
    buttonType: {
      googlePay: "buy",
      applePay: "buy",
    },
    layout: {
      maxColumns: 2, // Allow both buttons side by side
      maxRows: 1,
      overflow: "auto",
    },
    paymentMethods: {
      googlePay: "always",
      applePay: "auto",
    },
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quick Pay</h3>
          <p className="text-sm text-gray-600">Pay instantly with your digital wallet</p>
        </div>
      </div>

      {/* Express Checkout Container */}
      <div className="relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-xl opacity-50"></div>
        
        {/* Main container */}
        <div className="relative border-2 border-gray-200 rounded-xl p-6 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
          {/* Wallet buttons container */}
          <div className="min-h-[60px] flex items-center justify-center">
            <ExpressCheckoutElement
              options={expressOptions}
              onConfirm={async (event) => {
                if (!stripe || !elements) {
                  event.paymentFailed({
                    reason: "fail",
                    message: "Payment system not ready",
                  });
                  return;
                }

                try {
                  const { error, paymentIntent } = await stripe.confirmPayment({
                    elements,
                    clientSecret,
                    confirmParams: {
                      return_url: `${window.location.origin}/payment/success/?order=${orderId}`,
                    },
                    redirect: "if_required",
                  });

                  if (error) {
                    event.paymentFailed({
                      reason: "fail",
                      message: error.message || "Payment failed",
                    });
                    toast.error(error.message || "Payment failed");
                  } else if (paymentIntent?.status === "succeeded") {
                    toast.success("Payment completed successfully!");
                    window.location.href = `/payment/success/?order=${orderId}`;
                  } else {
                    toast.success("Payment processing...");
                    window.location.href = `/payment/success/?order=${orderId}`;
                  }
                } catch (err: any) {
                  event.paymentFailed({
                    reason: "fail", 
                    message: "Payment processing failed",
                  });
                  toast.error("Payment failed");
                }
              }}
              onClick={(event) => {
                try {
                  if (!stripe || !elements || !clientSecret) {
                    event.reject();
                    return;
                  }
                  event.resolve();
                } catch (error) {
                  event.reject();
                }
              }}
              onReady={() => {
                console.log("Express checkout ready - wallet buttons loaded");
              }}
              onLoadError={(error) => {
                console.error("Express checkout load error:", error);
                toast.error("Failed to load wallet payment options");
              }}
            />
          </div>

          {/* Features list */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span>Secure & encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-2 h-2 text-blue-500" />
                </div>
                <span>One-tap payment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-2 h-2 text-purple-500" />
                </div>
                <span>No card details needed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fallback message if no wallet buttons show */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Available payment methods depend on your device and browser
        </p>
      </div>
    </div>
  );
}
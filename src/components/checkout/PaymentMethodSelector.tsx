"use client";

import { useState, ReactNode } from "react";
import { CreditCard, ShoppingBag, Apple, Smartphone, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import CardCheckout from "./CardCheckout";
import ClearpayCheckout from "./ClearpayCheckout";
import KlarnaCheckout from "./KlarnaCheckout";
import { PaymentFormProps } from "./PaymentForm";
import WalletPayment from "./WalletPayment";

export type PaymentMethod = "card" | "clearpay" | "klarna";


interface Props {
  hasValidAddress: boolean;
  onCheckout: (method?: PaymentMethod) => Promise<PaymentFormProps | null>;
}

export default function PaymentMethodSelector({ hasValidAddress, onCheckout }: Props) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [checkoutData, setCheckoutData] = useState<PaymentFormProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleProceed = async (method: PaymentMethod) => {
    if (!hasValidAddress) return;
    setIsLoading(true);
    try {
      const result = await onCheckout(method);
      if (result) setCheckoutData(result);
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const methods: { key: PaymentMethod; label: string; icon: ReactNode }[] = [
    { key: "card", label: "Credit / Debit Card", icon: <CreditCard className="w-8 h-8 text-blue-600" /> },
    { key: "klarna", label: "Klarna", icon: <ShoppingBag className="w-8 h-8 text-purple-600" /> },
    { key: "clearpay", label: "Clearpay", icon: <ShoppingBag className="w-8 h-8 text-black" /> },
  ];


  // Always show all methods; Stripe handles wallet visibility internally
  const availableMethods = methods;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold text-blue-600">2. Payment Method</h2>
        {hasValidAddress && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Address Complete ✓</span>
        )}
      </div>

      {!hasValidAddress ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Please complete your delivery address to select a payment method.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {availableMethods.map(({ key, label, icon }) => (
            <div
              key={key}
              onClick={() => {
                setSelectedMethod(key);
                setCheckoutData(null);
              }}
              className={`w-full border rounded-xl p-6 cursor-pointer transition hover:shadow-md relative ${selectedMethod === key
                ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                : "border-blue-300 bg-white"
                }`}
            >
              <div className="flex items-center gap-4">
                {icon}
                <div className="flex-1">
                  <h3 className="font-medium text-blue-600">{label}</h3>
                </div>
                {selectedMethod === key && (
                  <span className="absolute top-3 right-3 text-xs bg-green-600 text-white px-2 py-1 rounded-full font-medium">
                    Selected
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMethod && hasValidAddress && !checkoutData && (
        <div className="pt-4">
          <button
            onClick={() => handleProceed(selectedMethod)}
            disabled={isLoading}
            className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-md bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isLoading ? "Setting up payment..." : `Proceed with ${selectedMethod.replace("_", " ")}`}
          </button>
        </div>
      )}

      {checkoutData && selectedMethod && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-blue-600 mb-4">Complete Your Payment</h3>

          {selectedMethod === "card" && (
            <CardCheckout
              clientSecret={checkoutData.clientSecret}
              orderId={checkoutData.orderId}
              customer_details={checkoutData.customer_details}
            />
          )}

          {selectedMethod === "clearpay" && (
            <ClearpayCheckout
              clientSecret={checkoutData.clientSecret}
              orderId={checkoutData.orderId}
            />
          )}

          {selectedMethod === "klarna" && (
            <KlarnaCheckout
              clientSecret={checkoutData.clientSecret}
              orderId={checkoutData.orderId}
            />
          )}
        </div>
      )}

    </div>
  );
}

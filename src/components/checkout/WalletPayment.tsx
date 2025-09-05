import { PaymentRequest } from "@stripe/stripe-js";
import { useStripe, PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

interface WalletPaymentProps {
  clientSecret: string;
  orderId: string;
}

export default function WalletPayment({ clientSecret, orderId }: WalletPaymentProps) {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [canUseWallet, setCanUseWallet] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "GB",
      currency: "GBP",
      total: {
        label: `Order ${orderId}`,
        amount: 1000, // replace with actual amount in pence
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setCanUseWallet(true);
        setPaymentRequest(pr);
      }
    });

    pr.on("paymentmethod", async (ev) => {
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: ev.paymentMethod.id,
      });

      if (error) {
        ev.complete("fail");
        console.error(error);
      } else {
        ev.complete("success");
        window.location.href = `/payment/success/?order=${orderId}`;
      }
    });
  }, [stripe, clientSecret, orderId]);

  if (!canUseWallet) return null;

  return paymentRequest ? (
    <PaymentRequestButtonElement options={{ paymentRequest }} />
  ) : null;
}

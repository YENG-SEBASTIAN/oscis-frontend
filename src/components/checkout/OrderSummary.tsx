"use client";

import { useCartStore } from "@/store/useCartStore";

export default function OrderSummary() {
  const { items } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // you can add taxes/shipping later if needed

  return (
    <aside className="bg-white p-6 rounded-2xl shadow-lg border h-fit sticky top-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>

      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between py-3 text-sm text-gray-700">
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span className="font-medium text-gray-800">
              ${ (item.price * item.quantity).toFixed(2) }
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-600">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-lg font-semibold text-gray-900 border-t pt-3">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </aside>
  );
}

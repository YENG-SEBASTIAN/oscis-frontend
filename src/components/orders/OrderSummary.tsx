"use client";

import Link from "next/link";
import { ArrowLeft, CreditCard, MapPin } from "lucide-react";
import { AppSettings } from "@/settings/settings";
import { formatDate } from "@/lib/utils";
import { Order } from "@/store/useOrderStore";

interface OrderSummaryProps {
  order: Order;
  statusSteps: { key: string; icon: React.ReactNode; label: string }[];
  loading?: boolean;
}

export default function OrderSummary({ order, statusSteps, loading }: OrderSummaryProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="bg-white rounded-xl shadow p-6 h-24" />
        <div className="bg-white rounded-xl shadow p-6 h-40" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-gray-200">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
          <h1 className="text-2xl font-bold text-black">Order #{order.order_number}</h1>
          <p className="text-md font-medium text-black">Placed on {formatDate(order.created_at)}</p>
        </div>
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-bold text-white ${
            order.order_status === "Cancelled" ? "bg-red-600" : "bg-blue-600"
          }`}
        >
          {statusSteps.find((s) => s.key === order.order_status)?.icon}
          <span>{order.order_status}</span>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 border border-gray-200">
        {/* Left - order info */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-black">Order Summary</h2>
          <div className="space-y-3 text-md">
            <div className="flex justify-between">
              <span className="font-medium text-black">Order Date</span>
              <span className="font-semibold text-black">{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-black">Total</span>
              <span className="font-semibold text-black">
                {AppSettings.currency}
                {order.total_price}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3 font-bold">
              <span className="text-black">Paid</span>
              <span className="text-blue-600">
                {AppSettings.currency}
                {order.payment.amount}
              </span>
            </div>
          </div>
        </div>

        {/* Right - payment & shipping */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <span className="font-bold text-black">Payment Method</span>
            </div>
            <p className="text-md text-black">{order.payment_method}</p>
            <p className="text-sm text-blue-600 font-semibold">
              Status: {order.payment.status}
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="font-bold text-black">Shipping Address</span>
            </div>
            <p className="text-md text-black">{order.address.full_address}</p>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { AppSettings } from '@/settings/settings';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  MapPin,
  ArrowLeft,
  Download,
  ShoppingCart,
  MessageCircle,
  Star,
} from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';

// ----------------------
// Status Steps
// ----------------------
const statusSteps = [
  { key: "Pending", label: "Pending", icon: <Clock className="w-5 h-5" /> },
  { key: "Paid & Confirmed", label: "Confirmed", icon: <CheckCircle className="w-5 h-5" /> },
  { key: "Processing", label: "Processing", icon: <Package className="w-5 h-5" /> },
  { key: "Shipped", label: "Shipped", icon: <Truck className="w-5 h-5" /> },
  { key: "Delivered", label: "Delivered", icon: <CheckCircle className="w-5 h-5" /> },
  { key: "Cancelled", label: "Cancelled", icon: <XCircle className="w-5 h-5" /> },
];

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// ----------------------
// Skeleton Loader
// ----------------------
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// ----------------------
// Component
// ----------------------
export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { ordersById, fetchOrderById, loadingOrder, error } = useOrderStore();
  const order = ordersById[id];

  useEffect(() => {
    if (id) fetchOrderById(id);
  }, [id, fetchOrderById]);

  // --------------------
  // Loading State
  // --------------------
  if (loadingOrder) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  // --------------------
  // Error State
  // --------------------
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold text-lg">
        Failed to load order: {error}
      </div>
    );
  }

  // --------------------
  // Not Found
  // --------------------
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <Package className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-black">Order Not Found</h1>
        <p className="text-black text-lg mt-2 mb-6">We couldn’t find an order with that ID.</p>
        <Link
          href="/account/orders"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </div>
    );
  }

  // --------------------
  // Timeline Logic
  // --------------------
  let timelineSteps = statusSteps;
  if (order.order_status === "Cancelled") {
    timelineSteps = statusSteps.filter(
      (s) => s.key === "Pending" || s.key === "Cancelled"
    );
  }
  const currentStepIndex = timelineSteps.findIndex(
    (s) => s.key === order.order_status
  );

  // --------------------
  // Render
  // --------------------
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
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
                {AppSettings.currency}{order.total_price}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3 font-bold">
              <span className="text-black">Paid</span>
              <span className="text-blue-600">
                {AppSettings.currency}{order.payment.amount}
              </span>
            </div>
          </div>
        </div>

        {/* Payment & Shipping */}
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

      {/* Order Items */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-black">
          Items ({order.items.length})
        </h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={item.product_image || "/placeholder.png"}
                  alt={item.product_name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-md font-bold text-black">{item.product_name}</h4>
                <p className="text-sm text-black">Qty: {item.quantity}</p>
                <p className="text-sm text-black">
                  Price: {AppSettings.currency}{item.price}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-black">
                  {AppSettings.currency}{item.total_price}
                </p>
                <button className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Buy Again
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-black mb-6">Order Tracking</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {timelineSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            return (
              <div key={step.key} className="flex items-center sm:flex-1">
                <div
                  className={`flex flex-col items-center sm:items-start ${
                    index < timelineSteps.length - 1 ? 'sm:w-full' : ''
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isCompleted
                        ? order.order_status === "Cancelled" && step.key === "Cancelled"
                          ? "bg-red-600 text-white"
                          : "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`mt-2 text-sm font-semibold ${
                      isCompleted
                        ? order.order_status === "Cancelled" && step.key === "Cancelled"
                          ? "text-red-600"
                          : "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`hidden sm:block h-1 w-full ${
                      index < currentStepIndex ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      {/* <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row gap-3 border border-gray-200">
        <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold">
          <Download className="h-4 w-4 mr-1" />
          Download Invoice
        </button>
        {order.order_status === 'Delivered' && (
          <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold">
            <Star className="h-4 w-4 mr-1" />
            Leave Review
          </button>
        )}
        <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-semibold">
          <MessageCircle className="h-4 w-4 mr-1" />
          Need Help?
        </button>
      </div> */}
    </div>
  );
}

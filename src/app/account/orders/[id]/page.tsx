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
// Helpers
// ----------------------
const getStatusDetails = (status: string) => {
  switch (status) {
    case 'Pending':
      return { color: 'bg-amber-600 text-white', icon: <Clock className="h-6 w-6" />, bgColor: 'bg-amber-100 border-amber-300' };
    case 'Processing':
      return { color: 'bg-blue-700 text-white', icon: <Package className="h-6 w-6" />, bgColor: 'bg-blue-100 border-blue-300' };
    case 'Shipped':
      return { color: 'bg-indigo-700 text-white', icon: <Truck className="h-6 w-6" />, bgColor: 'bg-indigo-100 border-indigo-300' };
    case 'Delivered':
      return { color: 'bg-green-700 text-white', icon: <CheckCircle className="h-6 w-6" />, bgColor: 'bg-green-100 border-green-300' };
    case 'Cancelled':
      return { color: 'bg-red-700 text-white', icon: <XCircle className="h-6 w-6" />, bgColor: 'bg-red-100 border-red-300' };
    default:
      return { color: 'bg-gray-700 text-white', icon: <Package className="h-6 w-6" />, bgColor: 'bg-gray-100 border-gray-300' };
  }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

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

  // Loading
  if (loadingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-800 text-xl font-bold">Loading order details...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-700 font-extrabold text-lg">Failed to load order: {error}</p>
      </div>
    );
  }

  // Not found
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-gray-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-800 mb-8 text-lg font-medium">We couldn’t find an order with that ID.</p>
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors text-lg"
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusDetails = getStatusDetails(order.order_status);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 space-y-6">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link
                href="/account/orders"
                className="inline-flex items-center text-blue-700 hover:text-blue-800 font-semibold text-base mb-2"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Orders
              </Link>
              <h1 className="text-3xl font-extrabold text-gray-900">Order Details</h1>
              <p className="text-gray-800 text-lg font-medium">Order #{order.order_number}</p>
            </div>
            <div className={`px-4 py-3 rounded-lg border ${statusDetails.bgColor}`}>
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-md font-bold text-lg ${statusDetails.color}`}>
                {statusDetails.icon}
                <span>{order.order_status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-md border p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between border-b py-3 text-lg">
                <span className="font-semibold text-gray-800">Order Date</span>
                <span className="font-bold text-gray-600">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between border-b py-3 text-lg">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-bold text-gray-600">{AppSettings.currency}{order.total_price}</span>
              </div>
              <div className="flex justify-between py-4 bg-blue-100 px-4 rounded-lg">
                <span className="text-xl font-extrabold text-gray-900">Paid</span>
                <span className="text-2xl font-extrabold text-blue-700">{AppSettings.currency}{order.payment.amount}</span>
              </div>
            </div>
          </div>

          {/* Payment & Shipping */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment & Shipping</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-6 w-6 text-gray-700" />
                  <span className="font-bold text-lg text-gray-900">Payment Method</span>
                </div>
                <p className="ml-8 text-lg font-medium text-gray-800">{order.payment_method}</p>
                <p className="ml-8 text-base text-gray-700 font-semibold">Status: {order.payment.status}</p>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-6 w-6 text-gray-700" />
                  <span className="font-bold text-lg text-gray-900">Shipping Address</span>
                </div>
                <p className="ml-8 text-lg font-medium text-gray-800">{order.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-md border p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Order Items ({order.items.length})
          </h3>
          <div className="space-y-5">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-5 p-5 bg-gray-100 rounded-lg">
                <div className="w-24 h-24 bg-white rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                  <Image
                    src={item.product.primary_image?.url || '/placeholder.png'}
                    alt={item.product_name}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-2 text-gray-900">{item.product_name}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-lg text-gray-800">Qty: <span className="font-bold">{item.quantity}</span></p>
                      <p className="text-lg text-gray-800">Price: <span className="font-bold">{AppSettings.currency}{item.price}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-extrabold text-gray-900">{AppSettings.currency}{item.total_price}</p>
                      <button className="mt-2 inline-flex items-center text-blue-700 hover:text-blue-800 text-base font-bold">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Buy Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-md border p-6 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 inline-flex items-center justify-center px-5 py-4 bg-blue-700 text-white font-bold text-lg rounded-lg hover:bg-blue-800">
            <Download className="h-5 w-5 mr-2" />
            Download Invoice
          </button>
          {order.order_status === 'Delivered' && (
            <button className="flex-1 inline-flex items-center justify-center px-5 py-4 bg-green-700 text-white font-bold text-lg rounded-lg hover:bg-green-800">
              <Star className="h-5 w-5 mr-2" />
              Leave Review
            </button>
          )}
          <button className="flex-1 inline-flex items-center justify-center px-5 py-4 bg-gray-700 text-white font-bold text-lg rounded-lg hover:bg-gray-800">
            <MessageCircle className="h-5 w-5 mr-2" />
            Need Help?
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { formatCurrency, formatDate } from '@/components/admin/helpers';
import { OrderStatus } from '@/store/useOrderStore';

const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Paid & Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export default function AdminOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const {
    fetchOrderById,
    selectedOrder: order,
    loadingOrder,
    error,
    updateOrderInStore,
    updateOrder,
  } = useOrderStore();

  const [newStatus, setNewStatus] = useState<OrderStatus | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderId) fetchOrderById(orderId, true);
  }, [orderId, fetchOrderById]);

  useEffect(() => {
    if (order) setNewStatus(order.order_status);
  }, [order]);

  const totalItems = order?.items?.reduce((sum, i) => sum + (i.quantity || 0), 0) ?? 0;

  const handleRefresh = async () => {
    if (!orderId) return;
    await fetchOrderById(orderId, true);
  };

  const handleUpdateStatus = async () => {
    if (!order || !newStatus || newStatus === order.order_status) return;
    setUpdating(true);
    try {
      const updatedOrder = await updateOrder(order.id, { order_status: newStatus });
      if (updatedOrder) updateOrderInStore(updatedOrder);
      await fetchOrderById(order.id as string, true);
    } finally {
      setUpdating(false);
    }
  };

  if (loadingOrder) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        <div className="animate-pulse bg-gray-200 h-8 w-1/3 rounded mb-6" />
        <div className="grid grid-cols-1 gap-6">
          <div className="animate-pulse bg-gray-200 h-48 rounded" />
          <div className="animate-pulse bg-gray-200 h-28 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">Failed to load order: {error}</p>
          <button
            onClick={() => fetchOrderById(orderId)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-semibold text-black mb-2">Order not found</h2>
        <p className="text-black mb-6">That order ID does not exist or is not available.</p>
        <Link href="/admin/orders" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div>
          <Link href="/admin" className="inline-flex items-center text-sm text-blue-600 hover:underline mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Link>
          <h1 className="text-2xl font-bold text-black">Order {order.order_number}</h1>
          <p className="text-sm text-black">Placed {formatDate(order.created_at)}</p>
          <p className="text-sm text-black mt-1">Items: <span className="font-medium">{totalItems}</span></p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1 rounded-md font-semibold text-white ${
              order.order_status === 'Cancelled' ? 'bg-red-600' : 'bg-blue-600'
            }`}
          >
            {order.order_status}
          </div>

          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded text-sm text-black hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items + Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-black">Order Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-black">Product</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-black">Unit price</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-black">Qty</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-black">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-6 py-4 flex items-center gap-4 text-black">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                          {item.product_image ? (
                            <Image src={item.product_image} alt={item.product_name} width={64} height={64} className="object-cover w-full h-full" />
                          ) : <div className="text-sm text-gray-500">No image</div>}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-black">{item.product_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-black">{formatCurrency(item.price)}</td>
                      <td className="px-6 py-4 text-black">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-black font-semibold">
                        {formatCurrency(Number(item.total_price ?? item.price * item.quantity))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-6 items-center">
              <div className="text-right">
                <div className="text-sm text-black">Subtotal</div>
                <div className="text-lg font-semibold text-black">{formatCurrency(order.total_price)}</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-black mb-4">Order Timeline</h3>
            <div className="relative pl-10">
              {ORDER_STATUSES.map((step, idx) => {
                const orderIndex = ORDER_STATUSES.indexOf(order.order_status);
                const completed = idx <= orderIndex && !(order.order_status === 'Cancelled' && step !== 'Cancelled');
                const isCancelledStep = step === 'Cancelled' && order.order_status === 'Cancelled';

                return (
                  <div key={step} className="relative mb-6 last:mb-0 flex items-start gap-4">
                    {/* Connector line */}
                    {idx < ORDER_STATUSES.length - 1 && (
                      <div className={`absolute top-10 left-4 w-1 h-full ${completed ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    )}
                    {/* Step circle */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 ${
                      isCancelledStep ? 'bg-red-600 text-white' : completed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      <span className="text-sm font-semibold">{idx + 1}</span>
                    </div>
                    <div className="pl-2">
                      <div className={`text-sm font-semibold ${isCancelledStep ? 'text-red-600' : completed ? 'text-black' : 'text-gray-700'}`}>
                        {step}
                      </div>
                      <div className="text-xs text-gray-500">{completed ? 'Reached' : 'Pending'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Customer, Payment, Admin Actions */}
        <aside className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-black mb-3">Customer</h4>
            <div className="text-sm text-black">
              <div className="font-medium">{order.address?.first_name} {order.address?.last_name}</div>
              <div className="mt-1">{order.address?.phone_number}</div>
            </div>
            <div className="mt-3 text-sm text-black">
              <div className="font-semibold">Shipping address</div>
              <div className="mt-1">{order.address?.full_address}</div>
              {order.address?.postal_code && <div className="mt-1">Postal: {order.address.postal_code}</div>}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-black mb-3">Payment</h4>
            <div className="text-sm text-black">
              <div>Method: <span className="font-medium">{order.payment_method}</span></div>
              <div className="mt-1">Status: <span className="font-medium">{order.payment?.status ?? order.payment_status}</span></div>
              {order.payment?.transaction_id && <div className="mt-1">Transaction: <span className="font-medium">{order.payment.transaction_id}</span></div>}
              <div className="mt-2 text-sm">Amount: <span className="font-semibold">{formatCurrency(order.payment?.amount ?? order.total_price)}</span></div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-black mb-3">Admin Actions</h4>
            <label className="block text-sm text-black mb-1">Order status</label>
            <div className="flex gap-2">
              <select
                value={newStatus ?? order.order_status}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="flex-1 px-3 py-2 border rounded text-black"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={handleUpdateStatus}
                disabled={updating || newStatus === order.order_status}
                className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

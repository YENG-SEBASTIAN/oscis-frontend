'use client';

import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/store/useOrderStore';
import { AppSettings } from '@/settings/settings';
import AuthGuard from "@/components/auth/AuthGuard";

// ---------- Helpers ----------
const getStatusDetails = (status: string) => {
  const map: Record<
    string,
    { color: string; icon: ReactNode }
  > = {
    Pending: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Clock className="h-4 w-4" />,
    },
    Processing: {
      color: 'bg-blue-100 text-blue-800',
      icon: <Package className="h-4 w-4" />,
    },
    Shipped: {
      color: 'bg-indigo-100 text-indigo-800',
      icon: <Truck className="h-4 w-4" />,
    },
    Delivered: {
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="h-4 w-4" />,
    },
    Cancelled: {
      color: 'bg-red-100 text-red-800',
      icon: <XCircle className="h-4 w-4" />,
    },
  };

  return (
    map[status] || {
      color: 'bg-gray-100 text-gray-800',
      icon: <Package className="h-4 w-4" />,
    }
  );
};

// ---------- Component ----------
export default function OrdersPage() {
  const { orders, loadingOrders, error, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <AuthGuard>
    <main className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Order History
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Review your recent purchases and their status.
        </p>
      </header>

      {/* Loading State */}
      {loadingOrders && (
        <div className="text-center py-10 text-gray-500">
          Loading orders...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-10 text-red-500">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loadingOrders && !error && orders.length === 0 && (
        <div className="text-center py-20">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No orders yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Your orders will appear here after purchase.
          </p>
          <div className="mt-6">
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Orders List */}
      <section className="space-y-6">
        {orders.map((order) => {
          const status = getStatusDetails(order.order_status);
          return (
            <Card
              key={order.id}
              className="border shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Order #{order.order_number}
                </h2>
                <Badge
                  className={`flex items-center gap-1 ${status.color}`}
                >
                  {status.icon}
                  <span className="text-sm">{order.order_status}</span>
                </Badge>
              </div>

              {/* Order Summary */}
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
                  <div>
                    <p className="text-gray-500">Order Date</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(order.created_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Items</p>
                    <p className="font-medium text-gray-900">
                      {order.items.reduce((total, item) => total + item.quantity, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Amount</p>
                    <p className="font-medium text-gray-900">
                      {AppSettings.currency}
                      {order.total_price}
                    </p>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="flex justify-end mt-6">
                  <Link href={`/account/orders/${order.id}`} passHref>
                    <Button
                      variant="outline"
                      className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
    </AuthGuard>
  );
}

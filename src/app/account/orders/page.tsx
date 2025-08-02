'use client';

import { format } from 'date-fns';
import Link from 'next/link';
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

interface Order {
  id: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: number;
}

const mockOrders: Order[] = [
  { id: 'ORD-3021', date: '2025-07-01', status: 'Delivered', total: 149.99, items: 3 },
  { id: 'ORD-2984', date: '2025-06-15', status: 'Shipped', total: 89.5, items: 2 },
  { id: 'ORD-2920', date: '2025-06-05', status: 'Cancelled', total: 60.0, items: 1 },
  { id: 'ORD-2855', date: '2025-05-20', status: 'Delivered', total: 125.25, items: 4 },
  { id: 'ORD-2799', date: '2025-05-01', status: 'Processing', total: 200.0, items: 5 },
  { id: 'ORD-2750', date: '2025-04-18', status: 'Pending', total: 99.99, items: 2 },
];

const getStatusDetails = (status: Order['status']) => {
  switch (status) {
    case 'Pending':
      return { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> };
    case 'Processing':
      return { color: 'bg-blue-100 text-blue-800', icon: <Package className="h-4 w-4" /> };
    case 'Shipped':
      return { color: 'bg-indigo-100 text-indigo-800', icon: <Truck className="h-4 w-4" /> };
    case 'Delivered':
      return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> };
    case 'Cancelled':
      return { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> };
  }
};

export default function OrdersPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Order History
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Review your recent purchases and their status.
        </p>
      </header>

      <section className="space-y-6">
        {mockOrders.map((order) => {
          const statusDetails = getStatusDetails(order.status);

          return (
            <Card
              key={order.id}
              className="border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Order #{order.id}
                </h2>
                <Badge className={`flex items-center gap-1 ${statusDetails.color}`}>
                  {statusDetails.icon}
                  <span className="text-sm">{order.status}</span>
                </Badge>
              </div>

              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
                  <div>
                    <p className="text-gray-500">Order Date</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(order.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Items</p>
                    <p className="font-medium text-gray-900">{order.items}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Amount</p>
                    <p className="font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

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

      {mockOrders.length === 0 && (
        <div className="text-center py-20">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No orders yet</h3>
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
    </main>
  );
}

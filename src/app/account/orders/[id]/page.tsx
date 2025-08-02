'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Truck, CheckCircle, Clock, XCircle, CreditCard, MapPin, ArrowLeft, Download, ShoppingCart, MessageCircle, Star } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface TrackingEvent {
  status: string;
  date: string;
  location?: string;
  notes?: string;
}

interface Order {
  id: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  items: OrderItem[];
  tracking: TrackingEvent[];
  paymentMethod: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const mockOrders: Order[] = [
  {
    id: 'ORD-3021',
    date: '2025-07-01',
    status: 'Delivered',
    total: 149.99,
    subtotal: 139.99,
    shipping: 8.99,
    tax: 1.01,
    paymentMethod: 'VISA •••• 4242',
    shippingAddress: {
      name: 'Alex Johnson',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States'
    },
    items: [
      { 
        name: 'Premium Wireless Headphones', 
        quantity: 1, 
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
      },
      { 
        name: 'Fast Charging Cable (2-Pack)', 
        quantity: 2, 
        price: 20.00,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop'
      },
    ],
    tracking: [
      { 
        status: 'Order Placed', 
        date: '2025-07-01',
        notes: 'Your order has been received and is being processed'
      },
      { 
        status: 'Processing', 
        date: '2025-07-01',
        notes: 'Preparing your items for shipment'
      },
      { 
        status: 'Shipped', 
        date: '2025-07-02',
        location: 'Brooklyn, NY',
        notes: 'Carrier: USPS (Tracking #: 9400111899561234567890)'
      },
      { 
        status: 'Out for Delivery', 
        date: '2025-07-04',
        location: 'New York, NY',
        notes: 'Package is on the delivery vehicle'
      },
      { 
        status: 'Delivered', 
        date: '2025-07-04',
        location: 'Front Door',
        notes: 'Package delivered successfully'
      },
    ],
  },
];

const getStatusDetails = (status: Order['status']) => {
  switch (status) {
    case 'Pending':
      return { 
        color: 'bg-amber-500 text-white', 
        icon: <Clock className="h-5 w-5" />,
        bgColor: 'bg-amber-50 border-amber-200'
      };
    case 'Processing':
      return { 
        color: 'bg-blue-600 text-white', 
        icon: <Package className="h-5 w-5" />,
        bgColor: 'bg-blue-50 border-blue-200'
      };
    case 'Shipped':
      return { 
        color: 'bg-indigo-600 text-white', 
        icon: <Truck className="h-5 w-5" />,
        bgColor: 'bg-indigo-50 border-indigo-200'
      };
    case 'Delivered':
      return { 
        color: 'bg-green-600 text-white', 
        icon: <CheckCircle className="h-5 w-5" />,
        bgColor: 'bg-green-50 border-green-200'
      };
    case 'Cancelled':
      return { 
        color: 'bg-red-600 text-white', 
        icon: <XCircle className="h-5 w-5" />,
        bgColor: 'bg-red-50 border-red-200'
      };
    case 'Returned':
      return { 
        color: 'bg-purple-600 text-white', 
        icon: <Truck className="h-5 w-5" />,
        bgColor: 'bg-purple-50 border-purple-200'
      };
    default:
      return { 
        color: 'bg-gray-600 text-white', 
        icon: <Package className="h-5 w-5" />,
        bgColor: 'bg-gray-50 border-gray-200'
      };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function OrderDetailPage() {
  const [selectedTab, setSelectedTab] = useState('details');
  
  // Mock getting order ID from params
  const orderId = 'ORD-3021';
  const order = mockOrders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8 text-lg">We couldn't find an order with that ID.</p>
          <Link 
            href="/account/orders"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusDetails = getStatusDetails(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link 
                  href="/account/orders"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Orders
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Details</h1>
              <p className="text-gray-600">Order #{order.id}</p>
            </div>
            <div className={`px-3 py-2 rounded-lg border ${statusDetails.bgColor}`}>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md font-semibold text-sm ${statusDetails.color}`}>
                {statusDetails.icon}
                <span>{order.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Order Date</span>
                  <span className="font-semibold text-gray-900">{formatDate(order.date)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold text-gray-900">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Shipping</span>
                  <span className="font-semibold text-gray-900">${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Tax</span>
                  <span className="font-semibold text-gray-900">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-blue-50 px-3 rounded-lg">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment & Shipping</h3>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">Payment Method</span>
                  </div>
                  <p className="text-gray-700 ml-7">{order.paymentMethod}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">Shipping Address</span>
                  </div>
                  <div className="ml-7 text-gray-700 space-y-1">
                    <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Order Items ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
          </h3>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-gray-700">Quantity: <span className="font-semibold">{item.quantity}</span></p>
                      <p className="text-gray-700">Price: <span className="font-semibold">${item.price.toFixed(2)} each</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${(item.quantity * item.price).toFixed(2)}</p>
                      <button className="mt-1 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Buy Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Tracking History</h3>
          <div className="space-y-4">
            {order.tracking.reverse().map((track, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    i === 0 ? 'bg-green-600 text-white' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {i === 0 ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-current" />
                    )}
                  </div>
                  {i < order.tracking.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h4 className="text-lg font-bold text-gray-900">{track.status}</h4>
                      <span className="text-gray-600 font-medium text-sm">
                        {formatDate(track.date)}
                      </span>
                    </div>
                    {track.location && (
                      <p className="text-gray-700 mb-1">
                        <strong>Location:</strong> {track.location}
                      </p>
                    )}
                    {track.notes && (
                      <p className="text-gray-700">{track.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </button>
            
            {order.status === 'Delivered' && (
              <button className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                <Star className="h-4 w-4 mr-2" />
                Leave Review
              </button>
            )}
            
            <button className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">
              <MessageCircle className="h-4 w-4 mr-2" />
              Need Help?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
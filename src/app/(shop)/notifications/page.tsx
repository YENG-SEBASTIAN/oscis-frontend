'use client';

import { BellOff, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Header from '@/components/layout/Header';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  time: string;
  read: boolean;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Order Confirmed',
      message: 'Your order #12345 has been confirmed and will ship within 24 hours',
      type: 'success',
      time: '2 mins ago',
      read: false,
    },
    {
      id: '2',
      title: 'Payment Failed',
      message: 'Payment for order #12346 failed. Please update your payment method',
      type: 'error',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      title: 'Special Offer',
      message: 'Get 20% off on your next purchase with code SAVE20. Offer expires in 48 hours.',
      type: 'info',
      time: '5 hours ago',
      read: true,
    },
    {
      id: '4',
      title: 'Shipping Update',
      message: 'Your order #12347 will be delayed by 2-3 business days due to high demand',
      type: 'warning',
      time: 'Yesterday',
      read: true,
    },
    {
      id: '5',
      title: 'Review Request',
      message: 'How was your recent purchase? Share your experience with us',
      type: 'info',
      time: '2 days ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast.success('Notification removed');
  };

  const deleteAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Notifications {unreadCount > 0 && `(${unreadCount} new)`}
            </h1>
            <div className="flex space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={deleteAll}
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <BellOff className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any notifications at this time.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to homepage
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li key={notification.id} className={`${!notification.read ? 'bg-blue-50' : ''}`}>
                  <div className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </p>
                          <div className="flex space-x-3">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                              >
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
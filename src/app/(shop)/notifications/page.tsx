'use client';

import { BellOff, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useNotificationStore } from '@/store/useNotificationStore';

export default function NotificationsPage() {
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications().catch(() =>
      toast.error('Failed to load notifications')
    );
  }, [fetchNotifications]);

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
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
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Notifications {unreadCount > 0 && `(${unreadCount} new)`}
            </h1>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Empty state */}
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <BellOff className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You don&apos;t have any notifications at this time.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Return to homepage
              </Link>
            </div>
          ) : (
            /* Notifications list */
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={!notification.read ? 'bg-blue-50' : ''}
                >
                  <div className="px-6 py-4">
                    <div className="flex items-start">
                      {/* Icon */}
                      <div className="flex-shrink-0 pt-1">
                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-medium ${
                              !notification.read
                                ? 'text-gray-900'
                                : 'text-gray-600'
                            }`}
                          >
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

'use client';

import { Bell, BellOff, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useNotificationStore } from '@/store/useNotificationStore';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // 🔗 store
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Close notifications when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

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
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed sm:absolute inset-0 sm:inset-auto sm:right-0 sm:mt-2 w-full sm:w-80 bg-white sm:rounded-lg shadow-lg overflow-hidden z-50 sm:border border-gray-200">
          {/* Mobile header */}
          <div className="sm:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close notifications"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4 border-b border-gray-200 bg-gray-50 hidden sm:block">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    markAllAsRead();
                    toast.success('All notifications marked as read');
                  }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="h-[calc(100vh-120px)] sm:max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">Failed to load notifications</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <BellOff className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You'll see notifications here when you have them
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <li key={notification.id} className="hover:bg-gray-50 active:bg-gray-100 transition-colors">
                    <div className={`px-4 py-3 ${!notification.read ? 'bg-blue-50' : ''}`}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">{getIcon(notification.type)}</div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <div className="flex space-x-2 ml-2">
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="text-gray-400 hover:text-blue-500 p-1"
                                  aria-label="Mark as read"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                  toast.success('Notification removed');
                                }}
                                className="text-gray-400 hover:text-red-500 p-1"
                                aria-label="Delete notification"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 break-words">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
            <Link
              href="/notifications"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

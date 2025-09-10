import { AppSettings } from "@/settings/settings";

export const formatCurrency = (value: number) =>
  `${AppSettings.currency}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Get Tailwind classes for a given status (order or stock).
 * Normalizes status to lowercase for consistency.
 */
export const getStatusColor = (status: string): string => {
  if (!status) return "bg-gray-100 text-gray-800";

  const key = status.toLowerCase();

  const colors: Record<string, string> = {
    // Orders
    "pending": "bg-yellow-100 text-yellow-800",
    "paid & confirmed": "bg-blue-100 text-blue-800",
    "confirmed": "bg-blue-100 text-blue-800",
    "processing": "bg-indigo-100 text-indigo-800",
    "shipped": "bg-purple-100 text-purple-800",
    "delivered": "bg-green-100 text-green-800",
    "cancelled": "bg-red-100 text-red-800",

    // Stock
    "in stock": "bg-green-100 text-green-800",
    "out of stock": "bg-gray-200 text-gray-800",

    // Generic
    "active": "bg-green-100 text-green-800",
    "inactive": "bg-gray-100 text-gray-800",
  };

  return colors[key] ?? "bg-gray-100 text-gray-800";
};

/**
 * Format a date string into readable format.
 * Example: "2025-09-06T16:42:01Z" → "Sep 6, 2025, 04:42 PM"
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

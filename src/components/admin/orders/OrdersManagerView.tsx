"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Search, Eye, Calendar } from "lucide-react";
import { formatCurrency, getStatusColor, formatDate } from "../helpers";
import { useOrderStore } from "@/store/useOrderStore";
import { useRouter } from "next/navigation";
import PaginationControls from "@/components/common/PaginationControls";

const OrdersManagerView: React.FC = () => {
  const { next, previous, count, orders, fetchOrders, loadingOrders, error } =
    useOrderStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const router = useRouter();

  // Initial load
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Client-side filtering by order number, customer name, or status
  const filtered = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return orders.filter((o) => {
      const orderNumberMatch = o.order_number.toLowerCase().includes(lowerSearch);
      const customerNameMatch = `${o.address?.first_name || ""} ${o.address?.last_name || ""}`
        .toLowerCase()
        .includes(lowerSearch);
      const statusMatch = o.order_status.toLowerCase().includes(lowerSearch);

      return orderNumberMatch || customerNameMatch || statusMatch;
    });
  }, [orders, searchTerm]);


  // Server-side filter for dates
  const handleFilter = useCallback(() => {
    fetchOrders({
      search_from: searchFrom || undefined,
      search_to: searchTo || undefined,
    });
  }, [searchFrom, searchTo, fetchOrders]);

  // Pagination handlers
  const handleNext = useCallback(() => {
    if (next) {
      fetchOrders({ page: new URL(next).searchParams.get("page") });
    }
  }, [next, fetchOrders]);

  const handlePrev = useCallback(() => {
    if (previous) {
      fetchOrders({ page: new URL(previous).searchParams.get("page") });
    }
  }, [previous, fetchOrders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Orders</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search box (client-side only) */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              aria-label="Search orders"
              type="text"
              placeholder="Search by order number, status or customer..."
              className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Date from (server-side) */}
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              aria-label="Search from date"
              type="date"
              className="w-full pl-10 text-black pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchFrom}
              onChange={(e) => setSearchFrom(e.target.value)}
            />
          </div>

          {/* Date to (server-side) */}
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              aria-label="Search to date"
              type="date"
              className="w-full pl-10 text-black pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
            />
          </div>

          {/* Filter button */}
          <div>
            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md whitespace-nowrap"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>


      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-6 font-semibold text-black">
                  Order ID
                </th>
                <th className="text-left py-3 px-6 font-semibold text-black">
                  Customer
                </th>
                <th className="text-left py-3 px-6 font-semibold text-black">
                  Total
                </th>
                <th className="text-left py-3 px-6 font-semibold text-black">
                  Status
                </th>
                <th className="text-left py-3 px-6 font-semibold text-black">
                  Date
                </th>
                <th className="text-left py-3 px-6 font-semibold text-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingOrders && (
                <tr>
                  <td colSpan={6} className="py-6 px-6 text-center text-black">
                    Loading orders...
                  </td>
                </tr>
              )}
              {error && !loadingOrders && (
                <tr>
                  <td colSpan={6} className="py-6 px-6 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              )}
              {!loadingOrders && !error && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 px-6 text-center text-black">
                    No orders found
                  </td>
                </tr>
              )}
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-gray-200">
                  <td className="py-4 px-6 font-medium text-black">
                    {order.order_number}
                  </td>
                  <td className="py-4 px-6 text-black">
                    {order.address?.first_name} {order.address?.last_name}
                  </td>
                  <td className="py-4 px-6 font-medium text-black">
                    {formatCurrency(order.total_price)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.order_status
                      )}`}
                    >
                      {order.order_status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-black">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        title="View"
                        onClick={() =>
                          router.push(`/admin/orders/${order.id}`)
                        }
                        className="p-2 text-black hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(next || previous) && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <PaginationControls
              count={count}
              currentCount={orders.length}
              next={next}
              previous={previous}
              isLoading={loadingOrders}
              onNext={handleNext}
              onPrev={handlePrev}
              itemLabel="orders"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersManagerView;

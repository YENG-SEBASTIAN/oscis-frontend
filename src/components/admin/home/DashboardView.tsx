"use client";

import React, { useEffect, useMemo } from "react";
import KPI from "../KPI";
import { formatCurrency, getStatusColor, formatDate } from "../helpers";
import { Package, ShoppingCart, Users, Database, AlertTriangle, Download } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { useAdminHomeStore } from "@/store/useAdminHomeStore";
import { useStockStore } from "@/store/useStockStore";
import { useOrderStore } from "@/store/useOrderStore";

const DashboardView: React.FC = () => {
  const { count: totalProducts, fetchProducts } = useProductStore();
  const { totalUsers, totalOrders, fetchTotalUsers, fetchTotalOrders } = useAdminHomeStore();
  const { stockSummary, fetchSummary } = useStockStore();
  const { orders, fetchOrders } = useOrderStore();

  // Fetch all dashboard data on mount
  useEffect(() => {
    fetchProducts();
    fetchTotalUsers();
    fetchTotalOrders();
    fetchSummary();
    fetchOrders();
  }, [fetchProducts, fetchTotalUsers, fetchTotalOrders, fetchSummary, fetchOrders]);

  // Low stock alerts
  const stockAlerts = useMemo(() => {
    return stockSummary
      .filter((s) => s.current_stock <= (s.minimum_stock_level ?? 0))
      .map((s) => ({
        id: s.product,
        productName: s.product_name,
        stock_status: s.stock_status,
        currentStock: s.current_stock,
        minStock: s.minimum_stock_level ?? 0,
      }));
  }, [stockSummary]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Dashboard Overview</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI
          title="Total Stock Items"
          value={stockSummary.reduce((acc, s) => acc + s.current_stock, 0)}
          icon={<Database className="text-black" size={24} />}
        />
        <KPI
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingCart className="text-black" size={24} />}
        />
        <KPI
          title="Total Products"
          value={totalProducts}
          icon={<Package className="text-black" size={24} />}
        />
        <KPI
          title="Total Customers"
          value={totalUsers}
          icon={<Users className="text-black" size={24} />}
        />
      </div>

      {/* Low Stock Alerts */}
      {stockAlerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-orange-600" size={20} />
            <h3 className="text-lg font-semibold text-black">Low Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            {stockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div>
                  <p className="font-medium text-black">{alert.productName}</p>
                  <p className="text-sm text-black">Status: {alert.stock_status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-orange-600 font-medium">{alert.currentStock} units left</p>
                  <p className="text-xs text-black">Min: {alert.minStock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-black">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-black">Customer Address</th>
                <th className="text-left py-3 px-4 font-medium text-black">Total</th>
                <th className="text-left py-3 px-4 font-medium text-black">Status</th>
                <th className="text-left py-3 px-4 font-medium text-black">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-black">{order.order_number}</td>
                  <td className="py-3 px-4 text-black">{order.address.full_address}</td>
                  <td className="py-3 px-4 text-black">{formatCurrency(order.total_price)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}
                    >
                      {order.order_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-black">{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;

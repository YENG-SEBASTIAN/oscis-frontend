'use client';

import React from "react";

import { AnalyticsData } from "./types";
import KPI from "./KPI";
import { formatCurrency,  } from "./helpers";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Download,
} from "lucide-react";


const AnalyticsView: React.FC<{ analytics: AnalyticsData }> = ({ analytics }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <div className="flex gap-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI title="Revenue" value={formatCurrency(analytics.totalRevenue)} icon={<DollarSign className="text-green-600" size={24} />} delta={analytics.revenueGrowth} />
        <KPI title="Orders" value={analytics.totalOrders} icon={<ShoppingCart className="text-blue-600" size={24} />} delta={analytics.orderGrowth} />
        <KPI title="Products" value={analytics.totalProducts} icon={<Package className="text-purple-600" size={24} />} />
        <KPI title="Customers" value={analytics.totalCustomers} icon={<Users className="text-orange-600" size={24} />} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics.topProducts.map((p, idx) => (
            <div key={idx} className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{p.name}</p>
                  <p className="text-sm text-gray-600">{p.sold} sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(p.revenue)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics.monthlyRevenue.map((m) => (
            <div key={m.month} className="p-4 bg-white rounded-lg border">
              <p className="text-sm text-gray-600">{m.month}</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(m.revenue)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default AnalyticsView;
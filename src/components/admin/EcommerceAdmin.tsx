"use client";

import React, { useState } from "react";
import {
  Package,
  ShoppingCart,
  Warehouse,
  BarChart3,
  Tags,
} from "lucide-react";

import DashboardView from "@/components/admin/home/DashboardView";
import ProductsManagerView from "@/components/admin/products/ProductsManagerView";
import CategoryManagerView from "@/components/admin/category/CategoryManagerView";
import OrdersManagerView from "@/components/admin/orders/OrdersManagerView";
import StockManagerView from "@/components/admin/stocks/StockManagerView";
import AnalyticsView from "@/components/admin/AnalyticsView";

import {
  initialProducts,
  initialOrders,
  initialStockAlerts,
  initialAnalytics,
} from "@/components/admin/mockData";
import {
  Product,
  Order,
  StockAlert,
  AnalyticsData,
} from "@/components/admin/types";

// =========================
// Sidebar Tabs Config
// =========================
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={18} /> },
  { id: "category", label: "Category", icon: <Tags size={18} className="text-purple-600" /> },
  { id: "products", label: "Products", icon: <Package size={18} className="text-purple-600" /> },
  { id: "orders", label: "Orders", icon: <ShoppingCart size={18} className="text-blue-600" /> },
  { id: "stock", label: "Stock", icon: <Warehouse size={18} className="text-gray-700" /> },
  // { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} className="rotate-90" /> },
] as const;

type TabId = (typeof TABS)[number]["id"];

// =========================
// Sidebar Component
// =========================
const Sidebar: React.FC<{
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}> = ({ activeTab, setActiveTab }) => (
  <aside className="lg:col-span-1 h-screen bg-white rounded-xl border shadow-sm flex flex-col">
    <div className="p-4 border-b">
      <h2 className="text-xl font-bold text-gray-900">Admin</h2>
    </div>
    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${
            activeTab === tab.id
              ? "bg-blue-50 border border-blue-100 text-blue-600 font-medium"
              : "hover:bg-gray-50 text-gray-700"
          }`}
        >
          <span className="w-6 h-6 flex items-center justify-center">
            {tab.icon}
          </span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  </aside>
);

// =========================
// Main Admin Page
// =========================
const EcommerceAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main content */}
        <main className="lg:col-span-4">
          <div className="space-y-6">
            {activeTab === "dashboard" && (<DashboardView />)}
            {activeTab === "products" && <ProductsManagerView />}
            {activeTab === "category" && <CategoryManagerView />}
            {activeTab === "orders" && (<OrdersManagerView/>)}
            {activeTab === "stock" && (<StockManagerView/>)}
            {/* {activeTab === "analytics" && (
              <AnalyticsView analytics={analytics} />
            )} */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EcommerceAdmin;

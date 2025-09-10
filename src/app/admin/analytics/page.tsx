'use client';

import React, { useMemo, useState } from "react";
import {
  Package,
  ShoppingCart,
  Warehouse,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  AlertTriangle,
  Calendar,
  Download,
  BarChart3
} from "lucide-react";

/* ===========================
   Types
   =========================== */
type ProductStatus = "active" | "inactive";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: ProductStatus;
  image: string;
  description: string;
  sku: string;
}

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: OrderStatus;
  date: string; // ISO or readable
  items: { productId: string; name: string; quantity: number; price: number }[];
}

interface StockAlert {
  id: string;
  productName: string;
  currentStock: number;
  minStock: number;
  sku: string;
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  orderGrowth: number;
  topProducts: { name: string; sold: number; revenue: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}

/* ===========================
   Helpers
   =========================== */
const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] ?? "bg-gray-100 text-gray-800";
};

/* ===========================
   Mock Data
   (Keep or replace with API calls)
   =========================== */
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 199.99,
    stock: 45,
    category: "Electronics",
    status: "active",
    image: "https://via.placeholder.com/60",
    description: "Premium wireless headphones with noise cancellation",
    sku: "WH-001",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 299.99,
    stock: 23,
    category: "Electronics",
    status: "active",
    image: "https://via.placeholder.com/60",
    description: "Advanced fitness tracking smartwatch",
    sku: "SW-002",
  },
  {
    id: "3",
    name: "Running Shoes",
    price: 129.99,
    stock: 8,
    category: "Sports",
    status: "active",
    image: "https://via.placeholder.com/60",
    description: "Lightweight running shoes for athletes",
    sku: "RS-003",
  },
];

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    total: 399.98,
    status: "processing",
    date: "2024-03-15",
    items: [{ productId: "1", name: "Wireless Headphones", quantity: 2, price: 199.99 }],
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    total: 299.99,
    status: "shipped",
    date: "2024-03-14",
    items: [{ productId: "2", name: "Smart Watch", quantity: 1, price: 299.99 }],
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    total: 129.99,
    status: "delivered",
    date: "2024-03-13",
    items: [{ productId: "3", name: "Running Shoes", quantity: 1, price: 129.99 }],
  },
];

const initialStockAlerts: StockAlert[] = [
  { id: "1", productName: "Running Shoes", currentStock: 8, minStock: 10, sku: "RS-003" },
  { id: "2", productName: "Smart Watch", currentStock: 23, minStock: 25, sku: "SW-002" },
];

const initialAnalytics: AnalyticsData = {
  totalRevenue: 25678.45,
  totalOrders: 156,
  totalProducts: 89,
  totalCustomers: 234,
  revenueGrowth: 12.5,
  orderGrowth: 8.3,
  topProducts: [
    { name: "Wireless Headphones", sold: 45, revenue: 8999.55 },
    { name: "Smart Watch", sold: 32, revenue: 9599.68 },
    { name: "Running Shoes", sold: 28, revenue: 3639.72 },
  ],
  monthlyRevenue: [
    { month: "Jan", revenue: 15000 },
    { month: "Feb", revenue: 18000 },
    { month: "Mar", revenue: 25678 },
  ],
};

/* ===========================
   Subcomponents
   =========================== */

const KPI: React.FC<{ title: string; value: React.ReactNode; icon?: React.ReactNode; delta?: string | number; deltaPositive?: boolean }> = ({
  title,
  value,
  icon,
  delta,
  deltaPositive = true,
}) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">{icon}</div>
    </div>
    {delta !== undefined && (
      <div className="flex items-center mt-4 text-sm">
        {deltaPositive ? <TrendingUp className="text-green-600" size={16} /> : <TrendingDown className="text-red-600" size={16} />}
        <span className={`${deltaPositive ? "text-green-600" : "text-red-600"} ml-1`}>{delta}%</span>
        <span className="text-gray-600 ml-2">from last month</span>
      </div>
    )}
  </div>
);

/* ---------------------------
   Dashboard
   --------------------------- */
const DashboardView: React.FC<{
  analytics: AnalyticsData;
  stockAlerts: StockAlert[];
  recentOrders: Order[];
}> = ({ analytics, stockAlerts, recentOrders }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI title="Total Revenue" value={formatCurrency(analytics.totalRevenue)} icon={<DollarSign className="text-green-600" size={24} />} delta={analytics.revenueGrowth} />
        <KPI title="Total Orders" value={analytics.totalOrders} icon={<ShoppingCart className="text-blue-600" size={24} />} delta={analytics.orderGrowth} />
        <KPI title="Total Products" value={analytics.totalProducts} icon={<Package className="text-purple-600" size={24} />} />
        <KPI title="Total Customers" value={analytics.totalCustomers} icon={<Users className="text-orange-600" size={24} />} />
      </div>

      {stockAlerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-orange-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            {stockAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-medium text-gray-900">{alert.productName}</p>
                  <p className="text-sm text-gray-600">SKU: {alert.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-orange-600 font-medium">{alert.currentStock} units left</p>
                  <p className="text-xs text-gray-500">Min: {alert.minStock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-blue-600">{order.id}</td>
                  <td className="py-3 px-4 text-gray-900">{order.customer}</td>
                  <td className="py-3 px-4 text-gray-900">{formatCurrency(order.total)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------
   Products Manager
   --------------------------- */
const ProductsManagerView: React.FC<{
  products: Product[];
  onAdd?: () => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
}> = ({ products, onAdd, searchTerm, setSearchTerm }) => {
  const filtered = useMemo(
    () =>
      products.filter(
        (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              aria-label="Search products"
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Product</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">SKU</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Price</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Stock</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Category</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{product.sku}</td>
                  <td className="py-4 px-6 text-gray-900">{formatCurrency(product.price)}</td>
                  <td className="py-4 px-6">
                    <span className={`font-medium ${product.stock <= 10 ? "text-red-600" : "text-gray-900"}`}>{product.stock}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{product.category}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>{product.status}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button title="View" className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <Eye size={16} />
                      </button>
                      <button title="Edit" className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">
                        <Edit size={16} />
                      </button>
                      <button title="Delete" className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 px-6 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------
   Orders Manager
   --------------------------- */
const OrdersManagerView: React.FC<{ orders: Order[]; searchTerm: string; setSearchTerm: (s: string) => void }> = ({ orders, searchTerm, setSearchTerm }) => {
  const filtered = useMemo(
    () => orders.filter((o) => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.toLowerCase().includes(searchTerm.toLowerCase())),
    [orders, searchTerm]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <div className="flex gap-3">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2">
            <Download size={16} />
            Export Orders
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input aria-label="Search orders" type="text" placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Order ID</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Items</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Total</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-blue-600">{order.id}</td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-600">{order.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">{order.items.map((item, idx) => <p key={idx} className="text-sm text-gray-900">{item.quantity}x {item.name}</p>)}</div>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">{formatCurrency(order.total)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{order.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button title="View" className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"><Eye size={16} /></button>
                      <button title="Edit" className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"><Edit size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 px-6 text-center text-gray-500">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------
   Stock Manager
   --------------------------- */
const StockManagerView: React.FC<{ products: Product[]; stockAlerts: StockAlert[] }> = ({ products, stockAlerts }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={16} />
          Stock Adjustment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-orange-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Stock Alerts</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stockAlerts.map((alert) => (
            <div key={alert.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{alert.productName}</h4>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Low Stock</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">SKU: {alert.sku}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-600 font-medium">{alert.currentStock} units left</span>
                <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Restock</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Stock Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Product</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">SKU</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Current Stock</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Min Stock</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const isLowStock = product.stock <= 10;
                return (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{product.sku}</td>
                    <td className="py-4 px-6">
                      <span className={`font-medium ${isLowStock ? "text-red-600" : "text-gray-900"}`}>{product.stock}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">10</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${isLowStock ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                        {isLowStock ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Adjust</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------
   Analytics
   --------------------------- */
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

/* ===========================
   Main Admin Component
   =========================== */
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: <BarIcon /> },
  { id: "products", label: "Products", icon: <Package className="text-purple-600" size={18} /> },
  { id: "orders", label: "Orders", icon: <ShoppingCart className="text-blue-600" size={18} /> },
  { id: "stock", label: "Stock", icon: <Warehouse className="text-gray-700" size={18} /> },
  { id: "analytics", label: "Analytics", icon: <BarIcon rotate /> },
] as const;

/* small helper to reuse a bar chart-like icon since lucide doesn't have BarChart3 in all sets */
function BarIcon({ rotate }: { rotate?: boolean } = { rotate: false }) {
  return <BarChart3 className={`text-gray-700 ${rotate ? "transform rotate-90" : ""}`} size={18} />;
}

const EcommerceAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [products] = useState<Product[]>(initialProducts);
  const [orders] = useState<Order[]>(initialOrders);
  const [stockAlerts] = useState<StockAlert[]>(initialStockAlerts);
  const [analytics] = useState<AnalyticsData>(initialAnalytics);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1 bg-white rounded-xl border p-4 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Admin</h2>
          <nav className="space-y-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                  activeTab === t.id ? "bg-blue-50 border border-blue-100 text-blue-600" : "hover:bg-gray-50"
                }`}
              >
                <span className="w-6 h-6 flex items-center justify-center">{t.icon}</span>
                <span className="font-medium">{t.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded bg-blue-600 text-white">
                <Plus size={16} />
                New Product
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded border">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search className="text-gray-400" size={18} />
              <input aria-label="global search" placeholder="Search products, orders, customers..." className="px-3 py-2 rounded border border-gray-300 w-80" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={18} />
              <button className="px-3 py-2 rounded border">Today</button>
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === "dashboard" && <DashboardView analytics={analytics} stockAlerts={stockAlerts} recentOrders={orders} />}
            {activeTab === "products" && <ProductsManagerView products={products} onAdd={() => alert("Add product")} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
            {activeTab === "orders" && <OrdersManagerView orders={orders} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
            {activeTab === "stock" && <StockManagerView products={products} stockAlerts={stockAlerts} />}
            {activeTab === "analytics" && <AnalyticsView analytics={analytics} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EcommerceAdmin;

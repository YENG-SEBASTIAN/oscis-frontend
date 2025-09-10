// mockData.ts
import { Product, Order, StockAlert, AnalyticsData } from "./types";
import { useCategoryStore } from "@/store/useCategoryStore";

// ============================
// Products
// ============================
export const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Wireless Headphones",
    price: 120,
    stock: 45,
    category: "Electronics",
    status: "active",
    image: "/images/products/headphones.jpg",
    description: "Noise-cancelling wireless headphones with 20h battery life.",
    sku: "WH-001",
  },
  {
    id: "p2",
    name: "Smart Watch",
    price: 199,
    stock: 12,
    category: "Wearables",
    status: "active",
    image: "/images/products/smartwatch.jpg",
    description: "Fitness-focused smartwatch with heart rate monitoring.",
    sku: "SW-010",
  },
  {
    id: "p3",
    name: "Gaming Mouse",
    price: 49,
    stock: 0,
    category: "Accessories",
    status: "inactive",
    image: "/images/products/mouse.jpg",
    description: "RGB gaming mouse with high-precision optical sensor.",
    sku: "GM-205",
  },
  {
    id: "p4",
    name: "Bluetooth Speaker",
    price: 89,
    stock: 8,
    category: "Audio",
    status: "active",
    image: "/images/products/speaker.jpg",
    description: "Portable Bluetooth speaker with deep bass sound.",
    sku: "BS-320",
  },
];

// ============================
// Orders
// ============================
export const initialOrders: Order[] = [
  {
    id: "o1",
    customer: "John Doe",
    email: "john@example.com",
    total: 199,
    status: "delivered",
    date: "2025-09-01",
    items: [{ productId: "p2", name: "Smart Watch", quantity: 1, price: 199 }],
  },
  {
    id: "o2",
    customer: "Sarah Smith",
    email: "sarah@example.com",
    total: 240,
    status: "processing",
    date: "2025-09-03",
    items: [
      { productId: "p1", name: "Wireless Headphones", quantity: 2, price: 120 },
    ],
  },
  {
    id: "o3",
    customer: "Mike Johnson",
    email: "mike@example.com",
    total: 89,
    status: "pending",
    date: "2025-09-04",
    items: [
      { productId: "p4", name: "Bluetooth Speaker", quantity: 1, price: 89 },
    ],
  },
];

// ============================
// Stock Alerts
// ============================
export const initialStockAlerts: StockAlert[] = [
  {
    id: "s1",
    productName: "Smart Watch",
    currentStock: 12,
    minStock: 15,
    sku: "SW-010",
  },
  {
    id: "s2",
    productName: "Gaming Mouse",
    currentStock: 0,
    minStock: 10,
    sku: "GM-205",
  },
  {
    id: "s3",
    productName: "Bluetooth Speaker",
    currentStock: 8,
    minStock: 20,
    sku: "BS-320",
  },
];

// ============================
// Analytics
// ============================
export const initialAnalytics: AnalyticsData = {
  totalRevenue: 25678.45,
  totalOrders: 156,
  totalProducts: initialProducts.length,
  totalCustomers: 234,
  revenueGrowth: 12.5,
  orderGrowth: 8.3,
  topProducts: [
    { name: "Wireless Headphones", sold: 120, revenue: 14400 },
    { name: "Smart Watch", sold: 80, revenue: 15920 },
    { name: "Bluetooth Speaker", sold: 65, revenue: 5785 },
  ],
  monthlyRevenue: [
    { month: "Jan", revenue: 3200 },
    { month: "Feb", revenue: 4100 },
    { month: "Mar", revenue: 5300 },
    { month: "Apr", revenue: 4700 },
    { month: "May", revenue: 3900 },
    { month: "Jun", revenue: 6100 },
    { month: "Jul", revenue: 7200 },
    { month: "Aug", revenue: 8300 },
    { month: "Sep", revenue: 2567 },
  ],
};

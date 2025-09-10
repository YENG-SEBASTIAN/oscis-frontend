export type ProductStatus = "active" | "inactive";

export interface Product {
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

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: OrderStatus;
  date: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
}

export interface StockAlert {
  id: string;
  productName: string;
  currentStock: number;
  minStock: number;
  sku: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  orderGrowth: number;
  topProducts: { name: string; sold: number; revenue: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}

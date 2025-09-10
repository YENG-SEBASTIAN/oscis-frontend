"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useStockStore } from "@/store/useStockStore";
import { Plus, AlertTriangle } from "lucide-react";
import { formatDate } from "../helpers";
import StockFormModal from "./StockFormModal";
import PaginationControls from "@/components/common/PaginationControls";

const StockManagerView: React.FC = () => {
  const { stockSummary, fetchSummary, loading, count, next, previous } = useStockStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "restock" | "adjust">("add");
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);

  // Fetch stock summary on mount
  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Low stock alerts
  const stockAlerts = useMemo(() => {
    return stockSummary
      .filter(
        (s) =>
          s.minimum_stock_level !== undefined &&
          s.current_stock <= (s.minimum_stock_level ?? 0)
      )
      .map((s) => ({
        id: s.product,
        productName: s.product_name,
        currentStock: s.current_stock,
        minStock: s.minimum_stock_level ?? 0,
      }));
  }, [stockSummary]);

  // Handlers
  const handleOpenModal = (mode: "add" | "restock" | "adjust", productId?: string) => {
    setModalMode(mode);
    setSelectedProduct(productId);
    setModalOpen(true);
  };

    // Pagination handlers
    const handleNext = useCallback(() => {
      if (next) {
        fetchSummary({ page: new URL(next).searchParams.get("page") });
      }
    }, [next, fetchSummary]);
  
    const handlePrev = useCallback(() => {
      if (previous) {
        fetchSummary({ page: new URL(previous).searchParams.get("page") });
      }
    }, [previous, fetchSummary]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
        <button
          onClick={() => handleOpenModal("add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          disabled={loading}
          aria-label="Add stock"
        >
          <Plus size={16} />
          Add Stock
        </button>
      </div>

      {/* Stock Alerts */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-orange-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Stock Alerts</h3>
        </div>

        {stockAlerts.length === 0 ? (
          <p className="text-sm text-gray-500">No low stock alerts 🎉</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {alert.productName}
                  </h4>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    Low Stock
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-600 font-medium">
                    {alert.currentStock} units left (min {alert.minStock})
                  </span>
                  <button
                    onClick={() => handleOpenModal("restock", alert.id)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    aria-label={`Restock ${alert.productName}`}
                  >
                    Restock
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock Overview Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Stock Overview</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-4 text-gray-500">Loading stock data...</p>
          ) : stockSummary.length === 0 ? (
            <p className="p-4 text-gray-500">No stock summary available.</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Product</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Current Stock</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Last Transaction</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stockSummary.map((stock) => (
                  <tr
                    key={stock.product}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {stock.product_name}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-medium ${
                          stock.stock_status === "Low Stock" ||
                          stock.stock_status === "Out of Stock"
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        {stock.current_stock}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          stock.stock_status === "In Stock"
                            ? "bg-green-100 text-green-800"
                            : stock.stock_status === "Low Stock"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {stock.stock_status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 capitalize">
                      {stock.last_transaction_type}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {formatDate(stock.created_at)}
                    </td>
                    <td className="py-4 px-6 space-x-2">
                      <button
                        onClick={() => handleOpenModal("restock", stock.product)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        disabled={loading}
                        aria-label={`Restock ${stock.product_name}`}
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => handleOpenModal("adjust", stock.product)}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                        disabled={loading}
                        aria-label={`Adjust ${stock.product_name}`}
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {(next || previous) && (
        <PaginationControls
          count={count}
          currentCount={stockSummary.length}
          next={next}
          previous={previous}
          isLoading={loading}
          onNext={handleNext}
          onPrev={handlePrev}
          itemLabel="stocks"
        />
      )}

      {/* Stock Form Modal */}
      <StockFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        productId={selectedProduct}
      />
    </div>
  );
};

export default StockManagerView;

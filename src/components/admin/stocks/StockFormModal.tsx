"use client";

import React, { useEffect, useState } from "react";
import { useStockStore } from "@/store/useStockStore";
import { useProductStore } from "@/store/useProductStore";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface StockFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "restock" | "adjust";
  productId?: string;
}

interface StockFormValues {
  product: string;
  quantity: number;
  notes?: string;
}

const StockFormModal: React.FC<StockFormModalProps> = ({
  open,
  onClose,
  mode,
  productId,
}) => {
  const { stockSummary, adjustStock, addStock, restockStock, fetchSummary } =
    useStockStore();
    const {fetchProducts, products} = useProductStore();
  const { register, handleSubmit, setValue, reset } = useForm<StockFormValues>();
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill product and reset form based on mode
  useEffect(() => {
    if (productId) setValue("product", productId);
    if (mode === "add") reset({ product: "", quantity: 1 });
    else reset({ product: productId, quantity: 1 });
    fetchProducts();
  }, [mode, productId, setValue, reset, fetchProducts]);

  const onSubmit = async (data: StockFormValues) => {
    if (!data.product || !data.quantity) return;

    setSubmitting(true);

    try {
      if (mode === "add") {
        await addStock({ product_id: data.product, quantity: data.quantity, notes: data.notes });
        toast.success("Stock added successfully!");
      } else if (mode === "restock") {
        await restockStock({ product_id: data.product, quantity: data.quantity, notes: data.notes });
        toast.success("Product restocked successfully!");
      } else if (mode === "adjust") {
        await adjustStock({ product_id: data.product, quantity: data.quantity, notes: data.notes });
        toast.success("Stock adjusted successfully!");
      }

      reset();
      onClose();
      fetchSummary(); // refresh stock summary
    } catch (error: any) {
      toast.error(error?.message || "Failed to save stock transaction");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative text-black">
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-5">
          {mode === "add"
            ? "Add New Stock"
            : mode === "restock"
            ? "Restock Product"
            : "Adjust Stock"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Product */}
          <div>
            <label className="block text-sm font-medium mb-1">Product</label>
            {mode === "add" ? (
              <select
                {...register("product", { required: true })}
                className="w-full border border-gray-300 rounded-lg p-2 text-black"
              >
                <option value="">Select product</option>
                {products.map((pro) => (
                  <option key={pro.id} value={pro.id}>
                    {pro.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={
                  stockSummary.find((s) => s.product === productId)?.product_name || ""
                }
                disabled
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-black"
              />
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              {...register("quantity", { required: true, min: 1 })}
              className="w-full border border-gray-300 rounded-lg p-2 text-black"
              placeholder="Enter quantity"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              {...register("notes")}
              className="w-full border border-gray-300 rounded-lg p-2 text-black"
              placeholder="Optional notes"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border bg-red-400 border-red-300 hover:bg-red-600 text-black"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockFormModal;

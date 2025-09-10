"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCategoryStore, Category } from "@/store/useCategoryStore";

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Category | null;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  open,
  onClose,
  initialData,
}) => {
  const { createCategory, updateCategory, isLoading } = useCategoryStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Partial<Category>>({
    defaultValues: {
      name: "",
      description: "",
      display_order: 0,
      is_active: true,
      featured: false,
      ...initialData,
    },
  });

  const [preview, setPreview] = useState<string | null>(
    initialData?.image?.url || null
  );
  const [file, setFile] = useState<File | null>(null);

  // Reset form when editing a different category
  useEffect(() => {
    reset(initialData || {
      name: "",
      description: "",
      display_order: 0,
      is_active: true,
      featured: false,
    });
    setPreview(initialData?.image?.url || null);
    setFile(null);
  }, [initialData, reset]);

  if (!open) return null;

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();

    // Append all fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "boolean" || typeof value === "number") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string);
        }
      }
    });

    if (file) formData.append("file_upload", file);

    try {
      if (initialData?.id) {
        await updateCategory(initialData.id, formData);
      } else {
        await createCategory(formData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Failed to save category. Check console for details.");
    }
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {initialData ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Name
            </label>
            <input
              {...register("name", { required: true })}
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter category name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Short description..."
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Display Order
            </label>
            <input
              type="number"
              {...register("display_order")}
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Category Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setFile(selectedFile);
                  const reader = new FileReader();
                  reader.onload = () => setPreview(reader.result as string);
                  reader.readAsDataURL(selectedFile);
                }
              }}
            />
            {preview && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-1">Preview:</p>
                <img
                  src={preview}
                  alt="Category Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>


          {/* Toggles */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <input
                type="checkbox"
                {...register("is_active")}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <input
                type="checkbox"
                {...register("featured")}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Featured
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {isSubmitting || isLoading
                ? "Saving..."
                : initialData
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;

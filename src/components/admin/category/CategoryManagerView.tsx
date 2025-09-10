"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { useCategoryStore, Category } from "@/store/useCategoryStore";
import CategoryFormModal from "./CategoryFormModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import PaginationControls from "@/components/common/PaginationControls";

const CategoryManagerView: React.FC = () => {
  const { next, previous, count, categories, deleteCategory, isLoading, fetchCategories } = useCategoryStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  // Filter categories by search term
  const filtered = useMemo(
    () =>
      categories.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.slug.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [categories, searchTerm]
  );


  // Pagination handlers
  const handleNext = useCallback(() => {
    if (next) {
      fetchCategories({ page: new URL(next).searchParams.get("page") });
    }
  }, [next, fetchCategories]);

  const handlePrev = useCallback(() => {
    if (previous) {
      fetchCategories({ page: new URL(previous).searchParams.get("page") });
    }
  }, [previous, fetchCategories]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => {
            setEditCategory(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              aria-label="Search categories"
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Category
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Slug
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Display Order
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((cat) => (
                  <tr key={cat.id} className="border-b border-gray-100">
                    <td className="py-4 px-6 flex items-center gap-3">
                      {cat.image?.url && (
                        <img
                          src={cat.image.url}
                          alt={cat.alt_text || cat.name}
                          className="w-12 h-12 object-cover rounded-lg border"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{cat.name}</p>
                        {cat.description && (
                          <p className="text-sm text-gray-600">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{cat.slug}</td>
                    <td className="py-4 px-6 text-gray-900">{cat.display_order}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          title="Edit"
                          onClick={() => {
                            setEditCategory(cat);
                            setModalOpen(true);
                          }}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => setDeleteTarget(cat)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 px-6 text-center text-gray-500"
                  >
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(next || previous) && (
        <PaginationControls
          count={count}
          currentCount={categories.length}
          next={next}
          previous={previous}
          isLoading={isLoading}
          onNext={handleNext}
          onPrev={handlePrev}
          itemLabel="categories"
        />
      )}

      {/* Add/Edit Modal */}
      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editCategory}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteCategory(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default CategoryManagerView;

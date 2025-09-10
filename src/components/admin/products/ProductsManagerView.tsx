'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { formatCurrency, getStatusColor } from '../helpers';
import ProductModal from './ProductModal';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import { ProductInterface } from '@/types/types';
import PaginationControls from '@/components/common/PaginationControls';

const ProductsManagerView: React.FC = () => {
  const { next, previous, count, products, isLoading: productsLoading, error, fetchProducts, deleteProduct } = useProductStore();
  const { categories, isLoading: categoriesLoading, fetchCategories } = useCategoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductInterface | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductInterface | null>(null);


  // Fetch products and categories on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Filter products by search term
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Open modal for creation
  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (product: ProductInterface) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Trigger delete confirmation
  const confirmDelete = (product: ProductInterface) => {
    setProductToDelete(product);
  };

  // Handle actual deletion after confirmation
  const handleDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  // Pagination handlers
  const handleNext = useCallback(() => {
    if (next) {
      fetchProducts({ page: new URL(next).searchParams.get("page") });
    }
  }, [next, fetchProducts]);

  const handlePrev = useCallback(() => {
    if (previous) {
      fetchProducts({ page: new URL(previous).searchParams.get("page") });
    }
  }, [previous, fetchProducts]);


  if (productsLoading || categoriesLoading) {
    return <div className="py-10 text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            aria-label="Search products"
            type="text"
            placeholder="Search products..."
            className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-6 font-medium text-gray-600">Product</th>
              <th className="text-left py-3 px-6 font-medium text-gray-600">Slug</th>
              <th className="text-left py-3 px-6 font-medium text-gray-600">Price</th>
              <th className="text-left py-3 px-6 font-medium text-gray-600">Category</th>
              <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-4 px-6 flex items-center gap-3">
                    {product.primary_image?.url && (
                      <img
                        src={product.primary_image.url}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{product.slug}</td>
                  <td className="py-4 px-6 text-gray-900">{formatCurrency(product.price)}</td>
                  <td className="py-4 px-6 text-gray-900">{product.category?.name}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        product.is_active ? "in stock" : "out of stock"
                      )}`}
                    >
                      {product.is_active ? "In Stock" : "Out Of Stock"}
                    </span>
                  </td>

                  <td className="py-4 px-6 flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      title="Edit"
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => confirmDelete(product)}
                      title="Delete"
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(next || previous) && (
        <PaginationControls
          count={count}
          currentCount={products.length}
          next={next}
          previous={previous}
          isLoading={productsLoading}
          onNext={handleNext}
          onPrev={handlePrev}
          itemLabel="products"
        />
      )}


      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct || undefined}
        categories={categories}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
};

export default ProductsManagerView;

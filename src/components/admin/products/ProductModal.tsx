'use client';

import React, { useEffect, useState } from 'react';
import { ProductInterface } from '@/types/types';
import { useProductStore } from '@/store/useProductStore';
import { X } from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductInterface;
  categories: CategoryOption[];
}

const badgeOptions = [
  'New',
  'New Arrival',
  'Popular',
  'Best Seller',
  "Editor's Choice",
  'Limited Edition',
];

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, categories }) => {
  const isEdit = !!product;
  const { createProduct, updateProduct } = useProductStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [badge, setBadge] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [category, setCategory] = useState<string>('');

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const [extraImageFiles, setExtraImageFiles] = useState<File[]>([]);
  const [extraImagePreviews, setExtraImagePreviews] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setOriginalPrice(product.original_price || '');
      setBadge(product.badge || '');
      setIsFeatured(product.is_featured);
      setIsActive(product.is_active);
      setCategory(product.category?.id || '');
      setMainImagePreview(product.primary_image?.url || null);
      setExtraImagePreviews(product.images.map((img) => img.image.url));
      setExtraImageFiles([]); // reset files because we only have URLs initially
    } else {
      // Reset form for new product
      setName('');
      setDescription('');
      setPrice('');
      setOriginalPrice('');
      setBadge('');
      setIsFeatured(false);
      setIsActive(true);
      setCategory('');
      setMainImageFile(null);
      setMainImagePreview(null);
      setExtraImageFiles([]);
      setExtraImagePreviews([]);
      setError(null);
    }
  }, [product, isOpen]);

  const handleMainImageChange = (file: File) => {
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleExtraImagesChange = (files: FileList) => {
    const newFiles = Array.from(files);
    setExtraImageFiles((prev) => [...prev, ...newFiles]);
    setExtraImagePreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
  };

  const handleRemoveExtraImage = (index: number) => {
    setExtraImageFiles((prev) => prev.filter((_, i) => i !== index));
    setExtraImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name || !description || !price || !category) {
      setError('Please fill all required fields');
      return;
    }

    if (price <= 0 || (originalPrice !== '' && originalPrice <= 0)) {
      setError('Price and Original Price must be greater than 0');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price.toString());
    if (originalPrice) formData.append('original_price', originalPrice.toString());
    formData.append('badge', badge);
    formData.append('is_featured', isFeatured ? 'true' : 'false');
    formData.append('is_active', isActive ? 'true' : 'false');
    formData.append('category', category);

    if (mainImageFile) formData.append('main_image', mainImageFile);
    extraImageFiles.forEach((file) => formData.append('extra_images', file));

    setIsSubmitting(true);
    setError(null);

    try {
      if (isEdit && product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
      {/* Transparent overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal content */}
      <div className="relative bg-white/95 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 text-black">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-black">Name*</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium text-black">Category*</label>
            <select
              className="w-full border rounded px-3 py-2 text-black"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 font-medium text-black">Price*</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 text-black"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          {/* Original Price */}
          <div>
            <label className="block mb-1 font-medium text-black">Original Price</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 text-black"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
            />
          </div>

          {/* Badge */}
          <div>
            <label className="block mb-1 font-medium text-black">Badge</label>
            <select
              className="w-full border rounded px-3 py-2 text-black"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
            >
              <option value="">Select badge</option>
              {badgeOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Featured & Active */}
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2 text-black">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-black">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Active
            </label>
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium text-black">Description*</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Main Image */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium text-black">Main Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleMainImageChange(e.target.files[0])}
            />
            {mainImagePreview && (
              <img src={mainImagePreview} className="w-32 h-32 mt-2 object-cover rounded" />
            )}
          </div>

          {/* Extra Images */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium text-black">Extra Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (!e.target.files) return;
                handleExtraImagesChange(e.target.files);
                e.target.value = ''; // Reset input so user can re-select same files
              }}
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {extraImagePreviews.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} className="w-20 h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExtraImage(i)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

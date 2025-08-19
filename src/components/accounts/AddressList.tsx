'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Plus, Loader2 } from 'lucide-react';
import { useAddressStore } from '@/store/addressStore';
import ConfirmDeleteModal from '../ui/ConfirmDeleteModal';

const addressSchema = z.object({
  recipient_name: z.string().min(1, 'Recipient name is required'),
  phone_number: z.string().min(9, 'Phone number is required'),
  address_line1: z.string().min(5, 'Address line 1 is required'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state_province: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  additional_instructions: z.string().optional(),
  is_default: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function AddressList() {
  const {
    addresses,
    loading,
    fetchAddresses,
    fetchDefaultAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddressStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    fetchAddresses();
    fetchDefaultAddress();
  }, []);

  const onSubmit = async (data: AddressFormData) => {
    try {
      if (editingId) {
        await updateAddress(editingId, data);
      } else {
        await createAddress(data);
      }
      reset();
      setFormOpen(false);
      setEditingId(null);
    } catch (err: any) {
      console.error(err);
    }
  };

  const onEdit = (address: any) => {
    setEditingId(address.id);
    setFormOpen(true);
    reset(address);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId !== null) {
      try {
        await deleteAddress(deleteId);
        setDeleteId(null);
      } catch (err) {
        console.log('Failed to delete address');
      }
    }
  };

  const onSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
    } catch (err) {
      console.log('Failed to update default address');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ConfirmDeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />

      {formOpen ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white border p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-400 mb-1">Recipient Name</label>
              <input
                {...register('recipient_name')}
                className={`w-full border px-3 py-2 rounded text-blue-400 placeholder-blue-200${errors.recipient_name ? 'border-red-400' : 'border-blue-300'
                  }`}
              />
              {errors.recipient_name && <p className="text-red-500 text-sm mt-1">{errors.recipient_name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-400 mb-1">Phone Number</label>
              <input
                {...register('phone_number')}
                className={`w-full border px-3 py-2 rounded text-blue-400 placeholder-blue-200 ${errors.phone_number ? 'border-red-400' : 'border-blue-300'
                  }`}
              />
              {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-blue-400 mb-1">Address Line 1</label>
              <input
                {...register('address_line1')}
                className={`w-full border px-3 py-2 rounded text-blue-400 placeholder-blue-200 ${errors.address_line1 ? 'border-red-400' : 'border-blue-300'
                  }`}
              />
              {errors.address_line1 && <p className="text-red-500 text-sm mt-1">{errors.address_line1.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-blue-400 mb-1">Address Line 2</label>
              <input {...register('address_line2')} className="w-full border px-3 py-2 rounded text-blue-400 placeholder-blue-200 border-blue-300" />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-400 mb-1">City</label>
              <input
                {...register('city')}
                className={`w-full border px-3 py-2 rounded text-blue-400 placeholder-blue-200 ${errors.city ? 'border-red-400' : 'border-blue-300'
                  }`}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-400 mb-1">State / Province</label>
              <input {...register('state_province')} className="w-full border px-3 py-2 rounded border-blue-300 text-blue-400 placeholder-blue-200" />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-400 mb-1">Postal Code</label>
              <input {...register('postal_code')} className="w-full border px-3 py-2 rounded border-blue-300 text-blue-400 placeholder-blue-200" />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-400 mb-1">Country</label>
              <input
                {...register('country')}
                className={`w-full border px-3 py-2 rounded text-blue-400 placeholder-blue-200 ${errors.country ? 'border-red-400' : 'border-blue-300'
                  }`}
              />
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-blue-400 mb-1">Additional Instructions</label>
              <textarea {...register('additional_instructions')}
                placeholder="E.g., Leave at the door, call on arrival, use side entrance, etc."
                className="w-full border px-3 py-2 rounded text-blue-400 placeholder-blue-200 border-blue-300" />
            </div>
          </div>

          <div className="flex items-center">
            <input type="checkbox" {...register('is_default')} id="is_default" className="mr-2" />
            <label htmlFor="is_default" className="text-sm text-blue-400">
              Set as default address
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
              {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Save Address
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setEditingId(null);
                setFormOpen(false);
              }}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-blue-400">Your Addresses</h2>
            <button
              onClick={() => {
                reset();
                setEditingId(null);
                setFormOpen(true);
              }}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New Address
            </button>
          </div>

          {loading ? (
            <div className="text-gray-600">Loading addresses...</div>
          ) : addresses.length === 0 ? (
            <div className="text-gray-600">No addresses found.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div key={address.id} className={`border rounded-lg p-4 transition ${address.is_default ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      {address.is_default && (
                        <span className="inline-block text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded mb-1">
                          Default
                        </span>
                      )}
                      <p className="font-medium text-gray-900">{address.recipient_name}</p>
                      <p className="text-sm text-gray-600">{address.phone_number}</p>
                      <p className="text-sm text-gray-600">{address.full_address}</p>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => onEdit(address)} className="text-gray-500 hover:text-blue-500" aria-label="Edit">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(address.id)} className="text-gray-500 hover:text-red-500" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {!address.is_default && (
                    <button onClick={() => onSetDefault(address.id)} className="mt-2 text-sm text-blue-600 hover:underline">
                      Set as default
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
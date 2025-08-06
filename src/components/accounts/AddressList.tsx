'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Plus, Loader2 } from 'lucide-react';
import { useAddressStore } from '@/store/addressStore';

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
  const [editingId, setEditingId] = useState<number | null>(null);

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
    } catch (err) {
      console.error(err);
    }
  };

  const onEdit = (address: any) => {
    Object.keys(addressSchema.shape).forEach((key) => {
      setValue(key as keyof AddressFormData, address[key]);
    });
    setEditingId(address.id);
    setFormOpen(true);
  };

  const onDelete = async (id: number) => {
    try {
      await deleteAddress(id);
    } catch (err) {
      console.error(err);
    }
  };

  const onSetDefault = async (id: number) => {
    try {
      await setDefaultAddress(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {formOpen ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h2>

          {Object.entries(addressSchema.shape).map(([key]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {key.replace(/_/g, ' ')}
              </label>
              <input
                {...register(key as keyof AddressFormData)}
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors[key as keyof AddressFormData] ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors[key as keyof AddressFormData] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[key as keyof AddressFormData]?.message as string}
                </p>
              )}
            </div>
          ))}

          <div className="flex items-center">
            <input type="checkbox" {...register('is_default')} id="is_default" className="mr-2" />
            <label htmlFor="is_default" className="text-sm text-gray-700">
              Set as default address
            </label>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Address'}
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
            <h2 className="text-xl font-semibold text-gray-800">Your Addresses</h2>
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
                <div
                  key={address.id}
                  className={`border rounded-lg p-4 transition ${
                    address.is_default ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}
                >
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
                      <button
                        onClick={() => onEdit(address)}
                        className="text-gray-500 hover:text-blue-500"
                        aria-label="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(address.id)}
                        className="text-gray-500 hover:text-red-500"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {!address.is_default && (
                    <button
                      onClick={() => onSetDefault(address.id)}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
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

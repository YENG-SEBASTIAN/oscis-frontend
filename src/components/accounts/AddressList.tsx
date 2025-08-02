'use client';

import { MapPin, Edit2, Trash2, Plus, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import toast from 'react-hot-toast';

const addressSchema = z.object({
  street: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  isDefault: z.boolean(),
});

type AddressData = z.infer<typeof addressSchema>;
type Address = AddressData & { id: string };

export default function AddressList({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isEditingAddress, setIsEditingAddress] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
  });

  const editAddress = (address: Address) => {
    setIsEditingAddress(address.id);
    setValue('street', address.street);
    setValue('city', address.city);
    setValue('state', address.state);
    setValue('postalCode', address.postalCode);
    setValue('country', address.country);
    setValue('isDefault', address.isDefault);
    setShowAddressForm(true);
  };

  const saveAddress = (data: AddressData) => {
    if (isEditingAddress) {
      setAddresses(addresses.map(addr => 
        addr.id === isEditingAddress ? { ...addr, ...data } : addr
      ));
      toast.success("Address updated");
    } else {
      setAddresses([...addresses, { ...data, id: Date.now().toString() }]);
      toast.success("Address added");
    }
    setIsEditingAddress(null);
    setShowAddressForm(false);
    reset();
  };

  const deleteAddress = (id: string) => {
    if (addresses.length <= 1) {
      toast.error("You must have at least one address");
      return;
    }
    setAddresses(addresses.filter(addr => addr.id !== id));
    toast.success("Address removed");
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast.success("Default address updated");
  };

  return (
    <div>
      {!showAddressForm ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Your Addresses</h2>
            <button
              onClick={() => {
                setIsEditingAddress(null);
                reset();
                setShowAddressForm(true);
              }}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New Address
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded-lg p-4 ${address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="flex justify-between">
                  <div>
                    {address.isDefault && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                        Default
                      </span>
                    )}
                    <h3 className="font-medium text-gray-900">
                      {address.street}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-500">{address.country}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editAddress(address)}
                      className="text-gray-400 hover:text-blue-500"
                      aria-label="Edit address"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteAddress(address.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {!address.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(address.id)}
                    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Set as default
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(saveAddress)} className="space-y-4 max-w-md">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {isEditingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
            <input
              {...register('street')}
              className={`w-full px-3 py-2 border rounded-md ${errors.street ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
            {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                {...register('city')}
                className={`w-full px-3 py-2 border rounded-md ${errors.city ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                {...register('state')}
                className={`w-full px-3 py-2 border rounded-md ${errors.state ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input
                {...register('postalCode')}
                className={`w-full px-3 py-2 border rounded-md ${errors.postalCode ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                {...register('country')}
                className={`w-full px-3 py-2 border rounded-md ${errors.country ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="defaultAddress"
              {...register('isDefault')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="defaultAddress" className="ml-2 block text-sm text-gray-700">
              Set as default address
            </label>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowAddressForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
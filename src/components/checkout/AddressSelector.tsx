'use client';

import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { useAddressStore } from '@/store/addressStore';
import CheckoutAddress, { AddressFormData } from './CheckoutAddress';

interface Props {
  onAddressChange: (addressId: string | null, newAddressData: AddressFormData | null) => void;
}

export default function AddressSelector({ onAddressChange }: Props) {
  const { addresses } = useAddressStore();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(addresses.length === 0);

  const handleSelectExisting = (addressId: string) => {
    setSelectedAddress(addressId);
    setShowNewAddressForm(false);
    onAddressChange(addressId, null);
  };

  const handleShowNewForm = () => {
    setSelectedAddress(null);
    setShowNewAddressForm(true);
    onAddressChange(null, null);
  };

  const handleNewAddressChange = (data: AddressFormData | null, isValid: boolean) => {
    onAddressChange(null, isValid && data ? data : null);
  };

  return (
    <div className="space-y-4">
      {/* Existing addresses */}
      {addresses.length > 0 && !showNewAddressForm && (
        <div className="space-y-3">
          {addresses.map(addr => (
            <button
              key={addr.id}
              onClick={() => handleSelectExisting(addr.id)}
              className={`w-full text-left border rounded-lg p-4 transition ${selectedAddress === addr.id ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-black hover:border-blue-400'}`}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-black">{addr.first_name} {addr.last_name}</p>
                  <p className="text-sm text-black">{addr.address_line}, {addr.city}, {addr.postal_code}</p>
                  <p className="text-sm text-black">{addr.phone_number}</p>
                </div>
                {selectedAddress === addr.id && <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Selected</span>}
              </div>
            </button>
          ))}
          <button onClick={handleShowNewForm} className="w-full text-left border-2 border-dashed border-blue-300 rounded-lg p-4 text-black hover:border-blue-400 hover:text-blue-700 transition">
            + Add a new address
          </button>
        </div>
      )}

      {/* New address form */}
      {showNewAddressForm && (
        <div>
          <CheckoutAddress onFormChange={handleNewAddressChange} />
          {addresses.length > 0 && (
            <button onClick={() => setShowNewAddressForm(false)} className="mt-3 text-sm text-black hover:text-blue-800">
              ← Back to saved addresses
            </button>
          )}
        </div>
      )}
    </div>
  );
}

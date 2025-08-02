'use client';

import { useState } from 'react';
import { Profile, AddressList } from '@/components/accounts';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
  };

  const initialAddresses = [
    {
      id: '1',
      street: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      id: '2',
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "United States",
      isDefault: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Settings</h1>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'addresses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Addresses
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && <Profile user={user} />}
            {activeTab === 'addresses' && <AddressList initialAddresses={initialAddresses} />}
          </div>
        </div>
      </div>
    </div>
  );
}
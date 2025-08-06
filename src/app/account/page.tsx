'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Profile, AddressList } from '@/components/accounts';

export default function AccountPage() {
  const { user, isAuthenticated, fetchUser } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');

  // Simulated default addresses (replace with dynamic data later)
  const initialAddresses = [
    {
      id: '1',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      isDefault: true,
    },
    {
      id: '2',
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'United States',
      isDefault: false,
    },
  ];

  // Fetch user on mount if not already present
  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  // Protect route: redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Show a loader or redirect message while waiting
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-blue-600 text-lg">Redirecting to login...</p>
      </div>
    );
  }

  const tabs: { key: 'profile' | 'addresses'; label: string }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'addresses', label: 'Addresses' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Settings</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-6 pt-4">
            <nav className="flex space-x-6">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === key
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'profile' && <Profile />}
            {activeTab === 'addresses' && <AddressList/>}
          </div>
        </div>
      </div>
    </div>
  );
}

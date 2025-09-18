"use client";

import { useState } from "react";
import { Profile, AddressList } from "@/components/accounts";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "addresses">("profile");

  const tabs: { key: "profile" | "addresses"; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "addresses", label: "Addresses" },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Account Settings
          </h1>

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
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === "profile" && <Profile />}
              {activeTab === "addresses" && <AddressList />}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

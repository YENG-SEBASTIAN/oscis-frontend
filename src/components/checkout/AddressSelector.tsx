"use client";

import { MapPin } from "lucide-react";
import { useAddressStore } from "@/store/addressStore";
import { useUserStore } from "@/store/useUserStore";

interface Props {
  selectedAddress: string | null;
  setSelectedAddress: (id: string) => void;
}

export default function AddressSelector({ selectedAddress, setSelectedAddress }: Props) {
  const { addresses } = useAddressStore();
  const { user } = useUserStore();

  if (addresses.length === 0) {
    return (
      <p className="text-gray-500 text-sm bg-gray-50 border p-4 rounded-lg">
        No saved addresses found. Please add one in your account settings.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <button
          key={addr.id}
          onClick={() => setSelectedAddress(addr.id)}
          className={`w-full text-left relative border rounded-xl p-5 transition shadow-sm hover:shadow-md
            ${selectedAddress === addr.id ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"}`}
        >
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="font-medium text-gray-800">
                {addr.recipient_name || ""}
              </p>
              <p className="text-sm text-gray-600">
                {addr.country} | {addr.city} | {addr.address_line1} | {addr.phone_number}
              </p>
            </div>
          </div>
          {selectedAddress === addr.id && (
            <span className="absolute top-3 right-3 text-xs bg-blue-600 text-white px-2 py-1 rounded-md">
              Selected
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

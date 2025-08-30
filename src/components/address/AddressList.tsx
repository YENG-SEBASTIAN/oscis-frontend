"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useAddressStore } from "@/store/addressStore";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import AddressForm from "./AddressForm";

export default function AddressList() {
  const {
    addresses,
    loading,
    fetchAddresses,
    fetchDefaultAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddressStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
    fetchDefaultAddress();
  }, [fetchAddresses, fetchDefaultAddress]);

  const handleEdit = (address: any) => {
    setEditingId(address.id);
    setFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await deleteAddress(deleteId);
        setDeleteId(null);
      } catch {
        toast.error("Failed to delete address");
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
    } catch {
      toast.error("Failed to update default address");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ConfirmDeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />

      <div className="space-y-6">
        {/* Address List */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-blue-400">Your Addresses</h2>
          <button
            onClick={() => {
              setEditingId(null);
              setFormOpen(true);
            }}
            disabled={formOpen}
            className={`flex items-center px-3 py-2 rounded-md text-sm transition
              ${formOpen
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            <Plus className="h-4 w-4 mr-1" /> Add New Address
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
                className={`border rounded-lg p-4 transition ${address.is_default
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    {address.is_default && (
                      <span className="inline-block text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded mb-1">
                        Default
                      </span>
                    )}
                    <p className="font-medium text-gray-900">
                      {address.first_name} {address.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{address.phone_number}</p>
                    <p className="text-sm text-gray-600">{address.full_address}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-gray-500 hover:text-blue-500"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(address.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Set as default
                  </button>
                )}
              </div>
            ))}
          </div>
        )}


        {formOpen && (
          <AddressForm
            defaultValues={
              editingId ? addresses.find((a) => a.id === editingId) : undefined
            }
            onCancel={() => {
              setEditingId(null);
              setFormOpen(false);
            }}
          />
        )}


      </div>
    </div>
  );
}

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import ApiService from '@/lib/apiService';
import { toast } from 'react-hot-toast';

export interface Address {
    id: string;
    user: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address_line: string;
    house_number?: string;
    city: string;
    postal_code?: string;
    country: string;
    is_default: boolean;
    additional_instructions?: string;
    full_address: string;
    created_at: string;
    updated_at: string;
}

interface AddressStore {
    addresses: Address[];
    defaultAddress: Address | null;
    loading: boolean;

    fetchAddresses: () => Promise<void>;
    fetchDefaultAddress: () => Promise<void>;
    createAddress: (data: Partial<Address> & { email: string }) => Promise<Address>;
    updateAddress: (id: string, data: Partial<Address>) => Promise<void>;
    deleteAddress: (id: string) => Promise<void>;
    setDefaultAddress: (id: string) => Promise<void>;
}

export const useAddressStore = create<AddressStore>()(
    devtools((set) => ({
        addresses: [],
        defaultAddress: null,
        loading: false,

        fetchAddresses: async () => {
            set({ loading: true });
            try {
                const data = await ApiService.get<{ results: Address[] }>('/address/');
                set({ addresses: data.results });
            } catch (err: any) {
                toast.error('Failed to load addresses');
            } finally {
                set({ loading: false });
            }
        },

        fetchDefaultAddress: async () => {
            try {
                const data = await ApiService.get<Address>('/address/default/');
                set({ defaultAddress: data });
            } catch (err: any) {
                if (err.response?.status === 404) {
                    set({ defaultAddress: null });
                } else {
                    toast.error('Error loading default address');
                }
            }
        },

        createAddress: async (data) => {
            set({ loading: true });
            try {
                const newAddress = await ApiService.post<Address>('/address/', data);
                toast.success('Address added');

                await Promise.all([
                    useAddressStore.getState().fetchAddresses(),
                ]);

                return newAddress;
            } catch (err: any) {
                toast.error(err.response?.data?.detail || 'Failed to add address');
                throw err;
            } finally {
                set({ loading: false });
            }
        },

        updateAddress: async (id, data) => {
            set({ loading: true });
            try {
                await ApiService.put(`/address/${id}/`, data);
                toast.success('Address updated');
                await Promise.all([
                    useAddressStore.getState().fetchAddresses(),
                    useAddressStore.getState().fetchDefaultAddress(),
                ]);
            } catch (err: any) {
                toast.error(err.response?.data?.detail || 'Failed to update address');
                throw err;
            } finally {
                set({ loading: false });
            }
        },

        deleteAddress: async (id) => {
            set({ loading: true });
            try {
                await ApiService.delete(`/address/${id}/`);
                toast.success('Address deleted');
                await Promise.all([
                    useAddressStore.getState().fetchAddresses(),
                    useAddressStore.getState().fetchDefaultAddress(),
                ]);
            } catch (err: any) {
                toast.error(err.response?.data?.detail || 'Failed to delete address');
                throw err;
            } finally {
                set({ loading: false });
            }
        },

        setDefaultAddress: async (id) => {
            set({ loading: true });
            try {
                await ApiService.post(`/address/${id}/set_default/`, {});
                toast.success('Default address updated');
                await Promise.all([
                    useAddressStore.getState().fetchAddresses(),
                    useAddressStore.getState().fetchDefaultAddress(),
                ]);
            } catch (err: any) {
                toast.error(err.response?.data?.detail || 'Failed to set default address');
                throw err;
            } finally {
                set({ loading: false });
            }
        },
    }))
);

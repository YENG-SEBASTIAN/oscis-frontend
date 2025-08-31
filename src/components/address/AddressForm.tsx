"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAddressStore } from "@/store/addressStore";

const addressSchema = z.object({
    email: z.string().email("Valid email is required"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    phone_number: z
        .string()
        .regex(
            /^(?:\+44\d{9,10}|0\d{10})$/,
            "Enter a valid UK phone number, e.g. +447123456789 or 07123456789"
        ),
    address_line: z.string().min(5, "Address line is required"),
    house_number: z.string().optional(),
    city: z.string().min(2, "City is required"),
    postal_code: z.string().optional(),
    country: z.string().min(2, "Country is required"),
    additional_instructions: z.string().optional(),
    is_default: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
    defaultValues?: Partial<AddressFormData & { id?: string }>;
    onSuccess?: () => void;
    onCancel: () => void;
}

export default function AddressForm({
    defaultValues,
    onSuccess,
    onCancel,
}: AddressFormProps) {
    const { createAddress, updateAddress } = useAddressStore();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues,
    });

    const handleFormSubmit = async (data: AddressFormData) => {
        try {
            if (defaultValues?.id) {
                await updateAddress(defaultValues.id, data);
                toast.success("Address updated");
            } else {
                await createAddress(data);
                toast.success("Address added");
            }
            reset();
            onSuccess?.(); // let parent refresh or close form
        } catch {
            toast.error("Failed to save address");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-8 bg-white border p-6 rounded-lg shadow"
        >
            <h2 className="text-2xl font-bold text-blue-500 mb-4">
                {defaultValues?.id ? "Edit Address" : "Add New Address"}
            </h2>

            {/* Basic Info */}
            <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-3">Basic Info</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-blue-400 mb-1">
                            First Name
                        </label>
                        <input
                            {...register("first_name")}
                            placeholder="John"
                            className={`w-full border text-blue-600 px-3 py-2 rounded placeholder:text-blue-300 ${errors.first_name ? "border-red-400" : "border-blue-300"
                                }`}
                        />
                        {errors.first_name && (
                            <p className="text-red-500 text-sm">{errors.first_name.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-400 mb-1">
                            Last Name
                        </label>
                        <input
                            {...register("last_name")}
                            placeholder="Doe"
                            className={`w-full border text-blue-600 px-3 py-2 rounded placeholder:text-blue-300 ${errors.last_name ? "border-red-400" : "border-blue-300"
                                }`}
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-sm">{errors.last_name.message}</p>
                        )}
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-blue-400 mb-1">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            placeholder="john@example.com"
                            className={`w-full border text-blue-600 px-3 py-2 rounded placeholder:text-blue-300 ${errors.email ? "border-red-400" : "border-blue-300"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-blue-400 mb-1">
                            Phone Number
                        </label>
                        <input
                            {...register("phone_number")}
                            placeholder="+44 7123 456789"
                            className={`w-full border text-blue-600 px-3 py-2 rounded placeholder:text-blue-300 ${errors.phone_number ? "border-red-400" : "border-blue-300"
                                }`}
                        />
                        {errors.phone_number && (
                            <p className="text-red-500 text-sm">
                                {errors.phone_number.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Address Info */}
            <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-3">
                    Address Info
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-blue-400 mb-1">
                            Country
                        </label>
                        <select
                            {...register("country")}
                            className="w-full border text-blue-600 px-3 py-2 rounded border-blue-300 bg-white"
                            defaultValue="United Kingdom"
                        >
                            <option value="United Kingdom">United Kingdom</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-400 mb-1">
                            Address
                        </label>
                        <input
                            {...register("address_line")}
                            placeholder="Baker Street"
                            className={`w-full border text-blue-600 px-3 py-2 rounded placeholder:text-blue-300 ${errors.city ? "border-red-400" : "border-blue-300"
                                }`}
                        />
                        {errors.address_line && (
                            <p className="text-red-500 text-sm">{errors.address_line.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-400 mb-1">
                            City
                        </label>
                        <input
                            {...register("city")}
                            placeholder="London"
                            className={`w-full border text-blue-600 px-3 py-2 rounded placeholder:text-blue-300 ${errors.city ? "border-red-400" : "border-blue-300"
                                }`}
                        />
                        {errors.city && (
                            <p className="text-red-500 text-sm">{errors.city.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-400 mb-1">
                            Postal Code
                        </label>
                        <input
                            {...register("postal_code")}
                            placeholder="NW1 6XE"
                            className="w-full border text-blue-600 px-3 py-2 rounded border-blue-300 placeholder:text-blue-300"
                        />
                    </div>
                </div>
            </div>

            {/* Other Details */}
            <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-3">
                    Other Details
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-blue-400 mb-1">
                            Additional Instructions
                        </label>
                        <textarea
                            {...register("additional_instructions")}
                            placeholder="Leave at door, call on arrival, etc."
                            className="w-full border text-blue-600 px-3 py-2 rounded border-blue-300 placeholder:text-blue-300"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            {...register("is_default")}
                            id="is_default"
                            className="mr-2"
                        />
                        <label htmlFor="is_default" className="text-sm text-blue-600">
                            Set as default address
                        </label>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                >
                    {isSubmitting && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                    Save Address
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

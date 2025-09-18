"use client";

import { useEffect } from "react";
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
  phone_number: z.string().optional(),
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
    defaultValues: defaultValues ?? ({} as Partial<AddressFormData>),
  });

  // IMPORTANT: reset whenever defaultValues changes (switching between add/edit)
  useEffect(() => {
    reset(defaultValues ?? ({} as Partial<AddressFormData>));
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data: AddressFormData) => {
    try {
      if (defaultValues?.id) {
        // Update existing address (PATCH)
        await updateAddress(defaultValues.id, data);
        toast.success("Address updated");
      } else {
        // Create new (API expects email on create in your store signature)
        await createAddress({ ...data, email: data.email });
        toast.success("Address added");
      }
      reset();
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to save address");
      // console.error(err); // uncomment for debugging if needed
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-8 bg-white border p-6 rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold text-black mb-4">
        {defaultValues?.id ? "Edit Address" : "Add New Address"}
      </h2>

      {/* Basic Info */}
      <div>
        <h3 className="text-lg font-semibold text-black mb-3">Basic Info</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">First Name</label>
            <input
              {...register("first_name")}
              placeholder="John"
              className={`w-full border text-black px-3 py-2 rounded placeholder:text-gray-400 ${errors.first_name ? "border-red-400" : "border-black"}`}
            />
            {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Last Name</label>
            <input
              {...register("last_name")}
              placeholder="Doe"
              className={`w-full border text-black px-3 py-2 rounded placeholder:text-gray-400 ${errors.last_name ? "border-red-400" : "border-black"}`}
            />
            {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-black mb-1">Email</label>
            <input
              {...register("email")}
              placeholder="john@example.com"
              className={`w-full border text-black px-3 py-2 rounded placeholder:text-gray-400 ${errors.email ? "border-red-400" : "border-black"}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-black mb-1">Phone Number</label>
            <input
              {...register("phone_number")}
              placeholder="+44 7123 456789"
              className={`w-full border text-black px-3 py-2 rounded placeholder:text-gray-400 ${errors.phone_number ? "border-red-400" : "border-black"}`}
            />
            {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
          </div>
        </div>
      </div>

      {/* Address Info */}
      <div>
        <h3 className="text-lg font-semibold text-black mb-3">Address Info</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Country</label>
            <select
              {...register("country")}
              className="w-full border text-black px-3 py-2 rounded border-black bg-white"
            >
              <option value="United Kingdom">United Kingdom</option>
              {/* add more countries if needed */}
            </select>
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Address</label>
            <input
              {...register("address_line")}
              placeholder="Baker Street"
              className={`w-full border text-black px-3 py-2 rounded placeholder:text-gray-400 ${errors.address_line ? "border-red-400" : "border-black"}`}
            />
            {errors.address_line && <p className="text-red-500 text-sm">{errors.address_line.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">House / Apt Number</label>
            <input
              {...register("house_number")}
              placeholder="221B"
              className="w-full border text-black px-3 py-2 rounded placeholder:text-gray-400 border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">City</label>
            <input
              {...register("city")}
              placeholder="London"
              className={`w-full border text-black px-3 py-2 rounded placeholder:text-gray-400 ${errors.city ? "border-red-400" : "border-black"}`}
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Postal Code</label>
            <input
              {...register("postal_code")}
              placeholder="NW1 6XE"
              className="w-full border text-black px-3 py-2 rounded placeholder:text-gray-400 border-black"
            />
          </div>
        </div>
      </div>

      {/* Other Details */}
      <div>
        <h3 className="text-lg font-semibold text-black mb-3">Other Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Additional Instructions</label>
            <textarea
              {...register("additional_instructions")}
              placeholder="Leave at door, call on arrival, etc."
              className="w-full border text-black px-3 py-2 rounded border-black placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" {...register("is_default")} id="is_default" className="mr-2" />
            <label htmlFor="is_default" className="text-sm text-black">Set as default address</label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center"
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

'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const addressSchema = z.object({
  email: z.string().email("Valid email is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_number: z.string().regex(/^(?:\+44\d{9,10}|0\d{10})$/, "Enter a valid UK phone number"),
  address_line: z.string().min(5, "Address line is required"),
  city: z.string().min(2, "City is required"),
  postal_code: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  additional_instructions: z.string().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface Props {
  onFormChange: (data: AddressFormData | null, isValid: boolean) => void;
}

export default function CheckoutAddress({ onFormChange }: Props) {
  const { register, watch, formState: { errors, isValid } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: "onChange",
    defaultValues: { country: "United Kingdom" }
  });

  const watchedValues = watch();

  useEffect(() => {
    onFormChange(isValid ? watchedValues : null, isValid);
  }, [watchedValues, isValid, onFormChange]);

  return (
    <form className="space-y-6 bg-white border p-6 rounded-lg">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">First Name</label>
          <input {...register("first_name")} placeholder="John" className={`w-full border px-3 py-2 rounded text-black placeholder-gray-400 ${errors.first_name ? "border-red-400" : "border-"}`} />
          {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Last Name</label>
          <input {...register("last_name")} placeholder="Doe" className={`w-full border px-3 py-2 rounded text-black placeholder-gray-400 ${errors.last_name ? "border-red-400" : "border-black"}`} />
          {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-black mb-1">Email</label>
          <input {...register("email")} placeholder="john@example.com" className={`w-full border px-3 py-2 rounded text-black placeholder-gray-400 ${errors.email ? "border-red-400" : "border-black"}`} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-black mb-1">Phone Number</label>
          <input {...register("phone_number")} placeholder="+44 7123 456789" className={`w-full border px-3 py-2 rounded text-black placeholder-gray-400 ${errors.phone_number ? "border-red-400" : "border-black"}`} />
          {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Address</label>
          <input {...register("address_line")} placeholder="123 Baker Street" className={`w-full border px-3 py-2 rounded text-black placeholder-gray-400 ${errors.address_line ? "border-red-400" : "border-black"}`} />
          {errors.address_line && <p className="text-red-500 text-sm mt-1">{errors.address_line.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">City</label>
          <input {...register("city")} placeholder="London" className={`w-full border px-3 py-2 rounded text-black placeholder-gray-400 ${errors.city ? "border-red-400" : "border-black"}`} />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Country</label>
          <select {...register("country")} className="w-full border px-3 py-2 rounded text-black bg-white border-black">
            <option value="United Kingdom">United Kingdom</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Postal Code</label>
          <input {...register("postal_code")} placeholder="NW1 6XE" className="w-full border px-3 py-2 rounded text-black placeholder-gray-400 border-black" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-black mb-1">Additional Instructions</label>
          <textarea {...register("additional_instructions")} placeholder="Leave at door, call on arrival, etc." className="w-full border px-3 py-2 rounded text-black placeholder-gray-400 border-black" rows={3} />
        </div>
      </div>
    </form>
  );
}

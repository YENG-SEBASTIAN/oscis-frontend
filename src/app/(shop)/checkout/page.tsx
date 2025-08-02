'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
  country: z.string().min(2, "Country is required"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      toast.loading("Processing your order...");
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.dismiss();
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Complete Your Purchase</h1>
        <p className="text-gray-600 text-center mb-8">Fill in your details to proceed with checkout</p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Billing Form */}
            <div className="md:w-1/2 p-8 border-r border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Billing Information</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    {...register("name")}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input
                    {...register("address")}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      {...register("city")}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                    <input
                      {...register("postalCode")}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.postalCode ? 'border-red-300' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input
                    {...register("country")}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.country ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex justify-center items-center disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    'Complete Purchase'
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="md:w-1/2 p-8 bg-gray-50">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Order</h2>
              
              <div className="space-y-4 mb-6">
                {/* Example cart items - replace with dynamic data */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-md w-16 h-16 mr-4"></div>
                    <div>
                      <h3 className="font-medium text-gray-800">Premium Leather Sneakers</h3>
                      <p className="text-sm text-gray-500">Size: 42</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">$149.99</p>
                    <p className="text-sm text-gray-500">Qty: 1</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-md w-16 h-16 mr-4"></div>
                    <div>
                      <h3 className="font-medium text-gray-800">Running Shoes</h3>
                      <p className="text-sm text-gray-500">Size: 40</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">$89.99</p>
                    <p className="text-sm text-gray-500">Qty: 1</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">$239.98</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">$9.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$19.20</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span>$269.17</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Secure Checkout</h3>
                <p className="text-sm text-blue-600">
                  Your information is protected by 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
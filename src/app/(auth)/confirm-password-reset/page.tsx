'use client';

import { useState, Suspense } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const resetConfirmSchema = z
  .object({
    newPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

type ResetConfirmData = z.infer<typeof resetConfirmSchema>;

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-1 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full border-2 border-blue-500 animate-pulse bg-gray-200"></div>
        </div>
        <div className="mt-6 text-center">
          <div className="h-8 bg-gray-200 rounded animate-pulse mx-auto w-48"></div>
        </div>
        <div className="mt-2 text-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-64"></div>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-blue-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// The actual component that uses useSearchParams
function ResetConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { confirmPasswordReset, loading } = useAuthStore();

  const uidb64 = searchParams.get('uidb64') || '';
  const token = searchParams.get('token') || '';

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetConfirmData>({
    resolver: zodResolver(resetConfirmSchema),
  });

  const onSubmit = async (data: ResetConfirmData) => {
    const toastId = toast.loading('Resetting your password...');
    try {
      console.log("uidb64:", uidb64);
      console.log("Token:", token);
      await confirmPasswordReset(uidb64, token, data.newPassword, data.confirmNewPassword);
      toast.dismiss(toastId);
      router.push('/login');
    } catch (err: any) {
      console.log(err)
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-1 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={48}
            height={48}
            className="h-12 w-auto rounded-full border-2 border-blue-500"
            priority
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set New Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  placeholder="Enter new password"
                  {...register('newPassword')}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm text-blue-400 placeholder-blue-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmNewPassword"
                  placeholder="Confirm new password"
                  {...register('confirmNewPassword')}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.confirmNewPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm text-blue-400 placeholder-blue-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmNewPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function ResetConfirmPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetConfirmContent />
    </Suspense>
  );
}
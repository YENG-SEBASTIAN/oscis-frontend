'use client';

import { Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type PasswordData = z.infer<typeof passwordSchema>;

export default function PasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: PasswordData) => {
    toast.success('Password updated');
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm transition-all">
        <h2 className="text-lg font-semibold text-blue-500 mb-4">Update Password</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm text-blue-500 mb-1">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
              <input
                type="password"
                {...register('currentPassword')}
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-md text-blue-500 focus:ring-1 focus:ring-blue-400 ${
                  errors.currentPassword ? 'border-red-400' : 'border-blue-400'
                }`}
              />
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm text-blue-500 mb-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
              <input
                type="password"
                {...register('newPassword')}
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-md text-blue-500 focus:ring-1 focus:ring-blue-400 ${
                  errors.newPassword ? 'border-red-400' : 'border-blue-400'
                }`}
              />
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-blue-500 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
              <input
                type="password"
                {...register('confirmPassword')}
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-md text-blue-500 focus:ring-1 focus:ring-blue-400 ${
                  errors.confirmPassword ? 'border-red-400' : 'border-blue-400'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 text-sm text-blue-500 bg-blue-100 hover:bg-blue-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

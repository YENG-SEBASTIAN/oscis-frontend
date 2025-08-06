'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your new password'),
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
  const { changePassword, logout, loading } = useAuthStore();
  const router = useRouter();

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordData) => {
    try {
      await changePassword(data.currentPassword, data.newPassword, data.confirmPassword);
      reset();
      onClose();
      await logout();
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">Change Password</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
              <input
                type={showPasswords.current ? 'text' : 'password'}
                {...register('currentPassword')}
                className={`w-full pl-9 pr-9 py-2 text-sm border rounded-md text-blue-700 focus:ring-1 focus:ring-blue-400 ${
                  errors.currentPassword ? 'border-red-400' : 'border-blue-300'
                }`}
              />
              <button
                type="button"
                onClick={() => toggleVisibility('current')}
                className="absolute right-3 top-2.5 text-blue-400 hover:text-blue-600"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                {...register('newPassword')}
                className={`w-full pl-9 pr-9 py-2 text-sm border rounded-md text-blue-700 focus:ring-1 focus:ring-blue-400 ${
                  errors.newPassword ? 'border-red-400' : 'border-blue-300'
                }`}
              />
              <button
                type="button"
                onClick={() => toggleVisibility('new')}
                className="absolute right-3 top-2.5 text-blue-400 hover:text-blue-600"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                {...register('confirmPassword')}
                className={`w-full pl-9 pr-9 py-2 text-sm border rounded-md text-blue-700 focus:ring-1 focus:ring-blue-400 ${
                  errors.confirmPassword ? 'border-red-400' : 'border-blue-300'
                }`}
              />
              <button
                type="button"
                onClick={() => toggleVisibility('confirm')}
                className="absolute right-3 top-2.5 text-blue-400 hover:text-blue-600"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 text-sm text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

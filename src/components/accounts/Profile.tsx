'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import PasswordModal from './PasswordModal';

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  image: z.string().optional(),
});

type ProfileData = z.infer<typeof profileSchema>;

export default function Profile({ user }: { user: ProfileData }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [preview, setPreview] = useState<string | null>(user.image || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: user,
  });

  const onSubmit = (data: ProfileData) => {
    toast.success('Profile updated successfully');
    console.log(data);
  };

  const imageInput = watch("image");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-blue-600 mb-1">Full Name</label>
          <input
            {...register('name')}
            className={`w-full px-3 py-2 border rounded-md text-blue-600 border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-600 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
            <input
              {...register('email')}
              className={`w-full pl-9 px-3 py-2 border rounded-md text-blue-600 border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
          </div>
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-600 mb-1">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
            <input
              {...register('phone')}
              className={`w-full pl-9 px-3 py-2 border rounded-md text-blue-600 border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
          </div>
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-600 mb-1">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-blue-500"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center px-4 py-2 border border-blue-400 text-blue-600 rounded-md hover:bg-blue-50"
          >
            <Lock className="h-4 w-4 mr-2" />
            Change Password
          </button>
        </div>
      </form>

      {/* Preview Section */}
      <div className="p-6 border rounded-xl bg-white shadow-sm space-y-4 text-blue-700 border-blue-300">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-24 w-24 rounded-full bg-blue-100 overflow-hidden">
            {preview ? (
              <img src={preview} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User className="h-full w-full text-blue-400 p-5" />
            )}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{watch("name")}</h3>
            <p className="text-sm">{watch("email")}</p>
            <p className="text-sm">{watch("phone")}</p>
          </div>
        </div>
      </div>

      <PasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  );
}

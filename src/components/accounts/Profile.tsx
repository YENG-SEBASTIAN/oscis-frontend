'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserStore } from '@/store/useUserStore';

const profileSchema = z.object({
  username: z.string().min(2, "Username is required"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  avatar: z.any().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const {
    user,
    fetchUser,
    updateUser,
    updateProfile,
  } = useUserStore();

  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        bio: user.profile?.bio || '',
        location: user.profile?.location || '',
      });
      setPreview(user.profile?.avatar || null);
    }
  }, [user, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setValue('avatar', file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const { avatar, bio, location, ...userFields } = data;

      await Promise.all([
        updateUser(userFields),
        updateProfile({ avatar, bio, location }),
      ]);

      await fetchUser();
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch {
      toast.error('Failed to update profile');
    }
  };

  if (!user) {
    return <p className="text-center py-8 text-blue-600">Loading profile...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Display */}
      <div className="p-6 border rounded-xl bg-white shadow-sm text-blue-700 border-blue-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex gap-6 items-center w-full md:w-auto">
          <div className="h-24 w-24 rounded-full bg-blue-100 overflow-hidden">
            {preview ? (
              <img src={preview} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-full w-full text-blue-400 p-5" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              {user?.full_name}
            </h3>
            <p className="text-sm text-blue-500">@{user.username}</p>
            <p className="text-sm">{user.phone_number}</p>
            <p className="text-sm">{user.profile?.location}</p>
          </div>
        </div>
        <div className="text-sm italic text-right text-blue-500 w-full md:w-1/2">
          {user.profile?.bio}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={() => setEditMode(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          Update Profile
        </button>
      </div>

      {/* Edit Form */}
      {editMode && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-6 border border-blue-200 rounded-xl bg-blue-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Username</label>
              <input
                {...register('username')}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:outline-none text-blue-700"
              />
              {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Phone Number</label>
              <input
                {...register('phone_number')}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:outline-none text-blue-700"
              />
              {errors.phone_number && <p className="text-sm text-red-500 mt-1">{errors.phone_number.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">First Name</label>
              <input
                {...register('first_name')}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:outline-none text-blue-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Last Name</label>
              <input
                {...register('last_name')}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:outline-none text-blue-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-blue-600 mb-1">Bio</label>
              <textarea
                {...register('bio')}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:outline-none text-blue-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-blue-600 mb-1">Location</label>
              <input
                {...register('location')}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:outline-none text-blue-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 border border-blue-400 text-blue-600 rounded-md hover:bg-blue-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

    </div>
  );
}

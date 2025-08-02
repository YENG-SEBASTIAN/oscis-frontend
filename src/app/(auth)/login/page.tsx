'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginData) => {
        try {
            toast.loading('Authenticating...');
            // Simulate login API call
            await new Promise((res) => setTimeout(res, 1000));
            toast.dismiss();
            toast.success('Login successful! Redirecting...');
            router.push("/")
        } catch (err) {
            toast.dismiss();
            toast.error('Login failed. Please check your credentials.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Image
                        src="/logo.jpg"
                        alt="Company Logo"
                        width={48}
                        height={48}
                        className="h-12 w-auto rounded-full border-2 border-blue-500"
                        priority
                    />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Welcome Back
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sign in to access your account
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-lg rounded-xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative rounded-md shadow-sm text-blue-500">
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    {...register('email')}
                                    className={`block w-full px-4 py-2.5 rounded-md border ${errors.email ? 'border-red-300' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    {...register('password')}
                                    className={`block w-full px-4 py-2.5 rounded-md border ${errors.password ? 'border-red-300' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 text-blue-500 focus:ring-blue-500 focus:border-blue-500 transition duration-150 pr-10`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link
                                    href="/forgot-password"
                                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-150"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-150"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            href="/register"
                            className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-150"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
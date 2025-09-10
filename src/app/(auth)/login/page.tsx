'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Loader2, Mail, KeyRound, ClipboardPaste } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuthStore } from '@/store/authStore';

// ====================
// Validation Schemas
// ====================
const emailSchema = z.object({
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Enter a valid email' }),
});

const codeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, { message: 'Code must be 6 digits' }),
});

type EmailData = z.infer<typeof emailSchema>;
type CodeData = z.infer<typeof codeSchema>;

// ====================
// Component
// ====================
export default function LoginPage() {
  const router = useRouter();
  const { sendLoginCode, verifyLoginCode, user, loading, isAuthenticated } =
    useAuthStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [hasMounted, setHasMounted] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Forms
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isValid: isEmailValid },
  } = useForm<EmailData>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
  });

  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
    setValue,
    formState: { errors: codeErrors },
  } = useForm<CodeData>({
    resolver: zodResolver(codeSchema),
  });

  // Handle hydration & redirect if logged in
  useEffect(() => {
    setHasMounted(true);
    if (user && isAuthenticated) {
      router.replace('/');
    }
  }, [user, isAuthenticated, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Step 1: Send login code
  const onEmailSubmit = async (data: EmailData) => {
    const toastId = toast.loading('Sending code...');
    try {
      await sendLoginCode(data.email);
      setEmail(data.email);
      setStep(2);
      setCooldown(30);
    } catch (error: any) {
      console.log(error?.message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  // Step 2: Verify code
  const onCodeSubmit = async (data: CodeData) => {
    const toastId = toast.loading("Verifying...");
    try {
      const response = await verifyLoginCode(email, data.code);

      // Check if the response includes user info with is_staff
      if (response?.user?.is_staff) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error(error?.message || "Invalid code");
      toast.error("Invalid code. Please try again.");
    } finally {
      toast.dismiss(toastId);
    }
  };


  // Paste from clipboard
  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.replace(/\D/g, '').slice(0, 6);
      if (cleaned.length === 6) {
        setValue('code', cleaned);
        toast.success('Code pasted from clipboard');
      } else {
        toast.error('Clipboard does not contain a valid 6-digit code');
      }
    } catch {
      toast.error('Failed to read clipboard');
    }
  };

  if (!hasMounted) return null; // prevent flicker during hydration

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center">
            <Image
              src="/logo.jpg"
              alt="Company Logo"
              width={60}
              height={60}
              className="mx-auto h-16 w-16 rounded-full border-2 border-blue-500 shadow-md"
              priority
            />
            <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
              {step === 1 ? 'Welcome Back' : 'Enter Verification Code'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 1
                ? 'Enter your email to receive a secure login code.'
                : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          {/* Step 1: Email */}
          {step === 1 && (
            <form
              onSubmit={handleEmailSubmit(onEmailSubmit)}
              className="mt-8 space-y-6"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...registerEmail('email')}
                  className={`block w-full pl-10 pr-3 py-2.5 rounded-md border ${emailErrors.email ? 'border-red-400' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
                  placeholder="you@example.com"
                />
              </div>
              {emailErrors.email && (
                <p className="text-sm text-red-600">{emailErrors.email.message}</p>
              )}

              <button
                type="submit"
                disabled={!isEmailValid || loading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-md shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-60 transition"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  'Send Code'
                )}
              </button>
            </form>
          )}

          {/* Step 2: Code */}
          {step === 2 && (
            <form
              onSubmit={handleCodeSubmit(onCodeSubmit)}
              className="mt-8 space-y-6"
            >
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                <input
                  id="code"
                  type="text"
                  maxLength={6}
                  {...registerCode('code')}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                  }}
                  className={`block w-full pl-10 pr-12 py-2.5 rounded-md border ${codeErrors.code ? 'border-red-400' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 tracking-widest text-center font-mono`}
                  placeholder="123456"
                />
                <button
                  type="button"
                  onClick={handlePasteCode}
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-blue-600"
                >
                  <ClipboardPaste className="h-5 w-5" />
                </button>
              </div>
              {codeErrors.code && (
                <p className="text-sm text-red-600">{codeErrors.code.message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-md shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-60 transition"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  'Verify & Login'
                )}
              </button>

              <p className="mt-4 text-center text-sm text-gray-600">
                Didn’t get the code?{' '}
                <button
                  type="button"
                  disabled={cooldown > 0}
                  className="text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50"
                  onClick={() => {
                    setStep(1);
                  }}
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend'}
                </button>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

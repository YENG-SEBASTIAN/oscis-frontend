"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, fetchUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-blue-600 text-lg">Redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
}

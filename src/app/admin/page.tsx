"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import EcommerceAdmin from "@/components/admin/EcommerceAdmin";

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!user?.is_active || !user?.is_staff) {
      router.replace("/"); // redirect normal users to home
    }
  }, [user, isAuthenticated, router]);

  if (!user?.is_staff) {
    return <p className="text-center text-gray-500 mt-20">Redirecting...</p>;
  }

  return <EcommerceAdmin />;
}

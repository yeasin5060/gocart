"use client";

import { useUser, SignIn } from "@clerk/nextjs";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminProtected({ children }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SignIn routing="hash" fallbackRedirectUrl="/admin" />
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
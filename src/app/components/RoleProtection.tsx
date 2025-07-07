"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface RoleProtectionProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
  fallback?: ReactNode;
}

export default function RoleProtection({ 
  children, 
  allowedRoles, 
  redirectTo = "/dashboard",
  fallback = <div className="min-h-screen flex items-center justify-center bg-white"><div className="text-green-600 text-lg">Loading...</div></div>
}: RoleProtectionProps) {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        // Redirect to sign-in if not authenticated
        router.push("/sign-in");
        return;
      }
      
      // Check if user has required role
      const userRole = user?.publicMetadata?.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
        // Redirect to specified route or show access denied
        router.push(redirectTo);
        return;
      }
    }
  }, [isLoaded, isSignedIn, user, router, allowedRoles, redirectTo]);

  // Show loading while checking authentication and role
  if (!isLoaded) {
    return <>{fallback}</>;
  }

  // Show loading while redirecting
  if (!isSignedIn || !user?.publicMetadata?.role || !allowedRoles.includes(user.publicMetadata.role as string)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
} 
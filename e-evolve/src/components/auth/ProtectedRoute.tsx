"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Recycle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");

    if (!role) {
      // Not logged in
      router.push("/login");
    } else if (!allowedRoles.includes(role)) {
      // Logged in but wrong role
      router.push("/");
    } else {
      // Authorized
      setIsAuthorized(true);
    }
  }, [router, allowedRoles]);

  if (isAuthorized === null) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
            <Recycle className="h-12 w-12 text-emerald-400 animate-spin-slow" />
            <p className="text-neutral-400 font-medium tracking-widest text-sm uppercase">Verifying Access</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

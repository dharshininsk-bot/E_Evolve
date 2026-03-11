"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Recycle, LayoutDashboard, Truck, Factory, Building2, Activity, LogOut } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/" || pathname === "/login" || pathname === "/signup";
  
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Read role from local storage on mount and path change
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setUserRole(null);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans">
      <nav className="fixed top-0 w-full bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Recycle className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                E-Evolve
              </span>
            </div>
            
            <div className="hidden md:block">
              {!isAuthPage ? (
                <div className="ml-10 flex items-center space-x-4">
                  {userRole === "CONSUMER" && <NavLink href="/consumer" icon={<LayoutDashboard size={18} />} text="Consumer" />}
                  {userRole === "COLLECTOR" && <NavLink href="/collector" icon={<Truck size={18} />} text="Collector" />}
                  {userRole === "RECYCLER" && <NavLink href="/recycler" icon={<Factory size={18} />} text="Recycler" />}
                  {userRole === "PRODUCER" && <NavLink href="/producer" icon={<Building2 size={18} />} text="Producer" />}
                  
                  <div className="w-px h-6 bg-neutral-800 mx-2"></div>
                  <NavLink href="/impact" icon={<Activity size={18} />} text="Impact Ledger" />
                  
                  {userRole && (
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all ml-4"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  )}
                </div>
              ) : (
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/login" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors px-3 py-2">
                    Log in
                  </Link>
                  <Link href="/signup" className="text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-4 py-2 rounded-lg transition-colors">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon, text }: { href: string; icon: ReactNode; text: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all"
    >
      {icon}
      {text}
    </Link>
  );
}

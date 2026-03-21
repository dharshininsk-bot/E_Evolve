"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  BarChart3, 
  Trash2, 
  Users, 
  Factory, 
  ShoppingBag, 
  Globe,
  Radio,
  RefreshCw,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const pathname = usePathname();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hedera/status");
      if (!res.ok) return;
      const data = await res.json();
      if (data.balance) {
        setBalance(data.balance);
      }
    } catch (err) {
      console.error("Failed to fetch balance", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000); // refresh every 30s
    
    // Check user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => clearInterval(interval);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const navItems = [
    { label: "Public Impact", icon: Globe, path: "/" },
  ];

  if (user) {
    const role = user.role.charAt(0) + user.role.slice(1).toLowerCase();
    navItems.push({ 
      label: `${role} Dashboard`, 
      icon: user.role === "CONSUMER" ? Users : user.role === "COLLECTOR" ? Trash2 : user.role === "RECYCLER" ? Factory : ShoppingBag, 
      path: `/dashboard/${user.role.toLowerCase()}` 
    });
  }

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-lg">E</div>
        <span className="text-xl font-bold tracking-tight">EVOLVE</span>
      </div>

      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                    isActive 
                      ? "bg-blue-600/10 text-blue-400 font-medium border border-blue-500/20" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "group-hover:text-blue-400")} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {!user && (
          <div className="px-4 mt-8">
            <Link
              href="/login"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              <Users className="w-5 h-5" />
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Hedera Status Indicator */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Hedera Live</span>
            </div>
            <button 
              onClick={fetchBalance}
              disabled={loading}
              className="p-1 hover:bg-slate-700 rounded transition"
            >
              <RefreshCw className={cn("w-3 h-3 text-slate-400", loading && "animate-spin")} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-mono text-white">
              {balance ? `${parseFloat(balance).toLocaleString()} HBAR` : "Connecting..."}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Testnet • Verified</p>
        </div>
      </div>
    </div>
  );
};

export default Navigation;

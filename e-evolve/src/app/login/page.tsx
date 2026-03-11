"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Truck, Factory, Building2, ChevronRight } from "lucide-react";
import Link from "next/link";

const ROLES = [
  { id: "CONSUMER", title: "Consumer", desc: "Track points & deposits", icon: LayoutDashboard, color: "text-emerald-400", bg: "bg-emerald-500/10", path: "/consumer" },
  { id: "COLLECTOR", title: "Waste Collector", desc: "Claim & collect bins", icon: Truck, color: "text-blue-400", bg: "bg-blue-500/10", path: "/collector" },
  { id: "RECYCLER", title: "Recycler", desc: "Verify & mint credits", icon: Factory, color: "text-indigo-400", bg: "bg-indigo-500/10", path: "/recycler" },
  { id: "PRODUCER", title: "Producer", desc: "Buy credits for compliance", icon: Building2, color: "text-rose-400", bg: "bg-rose-500/10", path: "/producer" },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login 
    setTimeout(() => {
      localStorage.setItem("userRole", selectedRole.id);
      router.push(selectedRole.path);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-neutral-400">Sign in to your E-Evolve account and select your dashboard.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-2xl glass-panel">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Email Address</label>
          <input 
            type="email" 
            required
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
          <input 
            type="password" 
            required
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div className="pt-2">
          <label className="block text-sm font-medium text-neutral-300 mb-3">Login As</label>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole.id === role.id;
              
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all ${
                    isSelected 
                      ? 'bg-neutral-800 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                      : 'bg-neutral-950/50 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg mb-2 ${isSelected ? role.bg : 'bg-neutral-900'}`}>
                    <Icon className={`w-5 h-5 ${isSelected ? role.color : 'text-neutral-500'}`} />
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-neutral-400'}`}>
                    {role.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl font-bold text-lg transition-all disabled:opacity-50 mt-4"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>Sign In <ChevronRight className="w-5 h-5" /></>
          )}
        </button>
      </form>

      <p className="text-center text-neutral-500 mt-8">
        Don't have an account? <Link href="/signup" className="text-emerald-400 hover:underline">Sign up</Link>
      </p>
    </div>
  );
}

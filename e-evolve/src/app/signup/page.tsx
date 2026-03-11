"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Truck, Factory, Building2, ChevronRight, Check } from "lucide-react";
import Link from "next/link";

const ROLES = [
  { id: "CONSUMER", title: "Consumer", desc: "Track points & deposits", icon: LayoutDashboard, color: "text-emerald-400", bg: "bg-emerald-500/10", path: "/consumer" },
  { id: "COLLECTOR", title: "Waste Collector", desc: "Claim & collect bins", icon: Truck, color: "text-blue-400", bg: "bg-blue-500/10", path: "/collector" },
  { id: "RECYCLER", title: "Recycler", desc: "Verify & mint credits", icon: Factory, color: "text-indigo-400", bg: "bg-indigo-500/10", path: "/recycler" },
  { id: "PRODUCER", title: "Producer", desc: "Buy credits for compliance", icon: Building2, color: "text-rose-400", bg: "bg-rose-500/10", path: "/producer" },
];

export default function SignupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API registration and redirect
    setTimeout(() => {
      localStorage.setItem("userRole", selectedRole.id);
      router.push(selectedRole.path);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mb-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Create an Account</h1>
        <p className="text-neutral-400">Join the circular plastic economy today.</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-2xl glass-panel">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">First Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Alex"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Last Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Green"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Email Address</label>
          <input 
            type="email" 
            required
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
          <input 
            type="password" 
            required
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Choose a strong password"
          />
        </div>

        <div className="pt-2">
          <label className="block text-sm font-medium text-neutral-300 mb-3">I am a...</label>
          <div className="space-y-3">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole.id === role.id;
              
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`w-full flex items-center p-4 rounded-xl border text-left transition-all ${
                    isSelected 
                      ? 'bg-neutral-800 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                      : 'bg-neutral-950/50 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-4 ${isSelected ? role.bg : 'bg-neutral-900'}`}>
                    <Icon className={`w-5 h-5 ${isSelected ? role.color : 'text-neutral-500'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                      {role.title}
                    </p>
                    <p className="text-xs text-neutral-500">{role.desc}</p>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-emerald-400" />}
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
            <>Create Account <ChevronRight className="w-5 h-5" /></>
          )}
        </button>
      </form>

      <p className="text-center text-neutral-500 mt-8">
        Already have an account? <Link href="/login" className="text-emerald-400 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

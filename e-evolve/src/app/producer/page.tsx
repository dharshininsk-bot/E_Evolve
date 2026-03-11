"use client";

import { useState, useEffect } from "react";
import { Building2, ShoppingCart, Target, ShieldCheck } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ProducerDashboard() {
  const [credits, setCredits] = useState<any[]>([]);
  const [buying, setBuying] = useState<string | null>(null);

  useEffect(() => {
    // Mock available HTS credits in the marketplace
    setCredits([
      { id: "CRD-9001", amount: 50, pricePerCredit: 2.50, seller: "GreenCity Recyclers" },
      { id: "CRD-9002", amount: 120, pricePerCredit: 2.45, seller: "EcoTech Processing" },
    ]);
  }, []);

  const handleBuy = (id: string, amount: number) => {
    setBuying(id);
    // Simulate Hedera Token Transfer and Database Update
    setTimeout(() => {
      setCredits(current => current.filter(c => c.id !== id));
      setBuying(null);
    }, 2000);
  };

  return (
    <ProtectedRoute allowedRoles={["PRODUCER"]}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Producer Obligations</h1>
          <p className="text-neutral-400">Purchase Plastic Recycling Credits (PRC) to meet EPR compliance.</p>
        </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Target className="w-5 h-5 text-rose-400" />}
          title="2026 Obligation Target"
          value="10,000 kg"
          trend="Annual Regulatory Requirement"
        />
        <StatCard 
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
          title="Credits Retired"
          value="4,500 PRC"
          trend="45% of target met"
        />
      </div>

      {/* Credit Marketplace */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden glass-panel">
        <div className="px-6 py-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-neutral-400" /> Credit Marketplace
          </h2>
        </div>
        
        {credits.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
             No credits currently available in the marketplace.
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/50">
            {credits.map((credit) => (
              <div key={credit.id} className="p-6 flex items-center justify-between hover:bg-neutral-800/30 transition-colors">
                <div className="flexItems-center gap-6">
                  <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-white text-lg">{credit.amount} PRC Bundle</p>
                      <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-700">
                        HTS Token: 0.0.98765
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 mt-1">Minted by {credit.seller}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-neutral-500 mb-1">Total Cost</p>
                    <p className="font-mono text-xl text-white">
                      ${(credit.amount * credit.pricePerCredit).toFixed(2)}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleBuy(credit.id, credit.amount)}
                    disabled={buying === credit.id}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                        buying === credit.id 
                        ? 'bg-neutral-800 text-neutral-400 cursor-wait'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                    }`}
                  >
                    {buying === credit.id ? (
                        <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <ShoppingCart className="w-5 h-5" />
                    )}
                    {buying === credit.id ? 'Transferring...' : 'Buy & Retire'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
     </div>
    </ProtectedRoute>
  );
}

function StatCard({ icon, title, value, trend }: any) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-neutral-700 transition-colors">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2.5 bg-neutral-800 rounded-xl">
          {icon}
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-neutral-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white mb-2">{value}</p>
        <p className="text-sm text-neutral-400 font-medium">{trend}</p>
      </div>
    </div>
  );
}

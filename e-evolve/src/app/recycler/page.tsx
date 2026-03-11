"use client";

import { useState, useEffect } from "react";
import { Factory, CheckCircle, Scale, ShieldCheck } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function RecyclerDashboard() {
  const [batches, setBatches] = useState<any[]>([]);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    // Mock incoming batches
    setBatches([
      { id: "B-2948", collector: "City Transport Inc.", declaredWeight: 145, status: "UNVERIFIED" },
      { id: "B-3102", collector: "Local Collect Co.", declaredWeight: 82, status: "UNVERIFIED" },
    ]);
  }, []);

  const handleVerify = (id: string, weight: number) => {
    setVerifying(id);
    // Simulate verification delay and Hedera Minting
    setTimeout(() => {
      setBatches(current => current.filter(b => b.id !== id));
      setVerifying(null);
    }, 2000);
  };

  return (
    <ProtectedRoute allowedRoles={["RECYCLER"]}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Recycler Module</h1>
          <p className="text-neutral-400">Verify incoming plastic batches and mint Hedera Token Service (HTS) credits.</p>
        </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Factory className="w-5 h-5 text-indigo-400" />}
          title="Verified Plastics"
          value="4,250 kg"
          trend="Total this year"
        />
        <StatCard 
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
          title="HTS Credits Minted"
          value="4,250 PRC"
          trend="1 kg = 1 Credit"
        />
      </div>

      {/* Verification Queue */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden glass-panel">
        <div className="px-6 py-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-neutral-400" /> Pending Verification Queue
          </h2>
        </div>
        
        {batches.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
             No pending deliveries to verify.
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/50">
            {batches.map((batch) => (
              <div key={batch.id} className="p-6 flex items-center justify-between hover:bg-neutral-800/30 transition-colors">
                <div className="flexItems-center gap-6">
                  <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <Factory className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-white text-lg">Batch {batch.id}</p>
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                        {batch.status}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 mt-1">Delivered by {batch.collector}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-neutral-500 mb-1">Declared Weight</p>
                    <p className="font-mono text-xl text-white">{batch.declaredWeight} <span className="text-sm text-neutral-400">kg</span></p>
                  </div>
                  
                  <button 
                    onClick={() => handleVerify(batch.id, batch.declaredWeight)}
                    disabled={verifying === batch.id}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                        verifying === batch.id 
                        ? 'bg-neutral-800 text-neutral-400 cursor-wait'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    }`}
                  >
                    {verifying === batch.id ? (
                        <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <CheckCircle className="w-5 h-5" />
                    )}
                    {verifying === batch.id ? 'Minting Credits on Hedera...' : 'Verify & Mint Credits'}
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

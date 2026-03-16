"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Scale, Package, Send, CheckCircle2, ChevronRight, Hash, Radio } from "lucide-react";

export default function CollectorDashboard() {
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [plasticType, setPlasticType] = useState("PET");
  const [isLogging, setIsLogging] = useState(false);
  const [result, setResult] = useState(null);

  const handleLogCollection = async (e) => {
    e.preventDefault();
    setIsLogging(true);
    setResult(null);

    try {
      const response = await fetch("/api/hedera/hcs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight,
          plasticType,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult({
          sequenceNumber: data.sequenceNumber,
          transactionId: data.transactionId,
          logId: data.logId,
          weight: weight,
          type: plasticType,
        });
        setWeight("");
        router.refresh(); // Force update stats
      } else {
        alert("Failed to log collection: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to ledger");
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Logging Hub</h1>
          <p className="text-slate-500 mt-1 uppercase tracking-wider text-xs font-semibold">Collector Dashboard • Hedera HCS Gateway</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trash2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Log New Collection</h3>
                <p className="text-xs text-slate-500 font-medium">Every gram is recorded immutably on Hedera</p>
              </div>
            </div>

            <form onSubmit={handleLogCollection} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                    <Scale className="w-4 h-4" />
                    <span>Weight (kg)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    disabled={isLogging}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 15.0"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition outline-none text-lg font-medium disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>Plastic Type</span>
                  </label>
                  <select
                    value={plasticType}
                    disabled={isLogging}
                    onChange={(e) => setPlasticType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition outline-none bg-white text-lg disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="PET">PET (Bottles)</option>
                    <option value="HDPE">HDPE (Milk Jugs)</option>
                    <option value="LDPE">LDPE (Bags)</option>
                    <option value="PP">PP (Caps/Straws)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLogging}
                className="w-full bg-slate-900 text-white rounded-xl py-4 flex items-center justify-center space-x-3 hover:bg-slate-800 transition active:scale-[0.98] disabled:opacity-50 font-bold text-lg"
              >
                {isLogging ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Transacting with Ledger...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit to Ledger</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Status / Success Feed */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden h-full">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-4">Logging Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-400 text-sm">Today's Collections</span>
                  <span className="font-mono">124.5 kg</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-400 text-sm">Pending Verify</span>
                  <span className="font-mono text-yellow-400">3 Logs</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-400 text-sm">On-Chain Sync</span>
                  <span className="text-green-400 flex items-center font-bold">100% 🚀</span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Radio className="w-24 h-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification - Sequence Number Focus */}
      {result && (
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200 animate-in slide-in-from-bottom duration-500 shadow-lg shadow-green-500/5">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-500 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-green-900 leading-none">Log Successful</h3>
                <span className="px-2 py-1 bg-green-200 text-green-700 text-[10px] font-bold uppercase rounded tracking-widest leading-none">Immutable</span>
              </div>
              <p className="text-green-700 mt-2 font-medium">Your donation of <span className="font-bold underline">{result.weight}kg {result.type}</span> was successfully broadcast to the Hedera network.</p>
              
              <div className="mt-6 p-6 bg-white rounded-xl border border-green-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Hash className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">HCS Sequence Number</p>
                    <p className="text-lg font-mono font-bold text-slate-800 tracking-tight">{result.sequenceNumber}</p>
                  </div>
                </div>
                <div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>
                <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">On-Chain ID</p>
                        <p className="text-xs font-mono text-slate-400">{result.transactionId || 'PENDING'}</p>
                    </div>
                  <a 
                    href={`https://hashscan.io/testnet/transaction/${result.transactionId || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition"
                  >
                    <span>View Explorer</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

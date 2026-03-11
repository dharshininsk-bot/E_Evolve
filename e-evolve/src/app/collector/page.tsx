"use client";

import { useState, useEffect } from "react";
import { Truck, MapPin, Package, Check, Clock } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CollectorDashboard() {
  const [availableLogs, setAvailableLogs] = useState<any[]>([]);

  useEffect(() => {
    // Mock available plastics to collect
    setAvailableLogs([
      { id: "101", type: "PET", weight: 12.5, location: "Downtown Bin #44", timestamp: new Date().toISOString() },
      { id: "102", type: "HDPE", weight: 8.2, location: "Northside Bin #12", timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: "103", type: "PP", weight: 15.0, location: "Eastgate Bin #8", timestamp: new Date(Date.now() - 7200000).toISOString() },
    ]);
  }, []);

  const handleCollect = (id: string) => {
    setAvailableLogs(logs => logs.filter(l => l.id !== id));
    // Here we would call the API: POST /api/collector/marketplace
  };

  return (
    <ProtectedRoute allowedRoles={["COLLECTOR"]}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Collector Marketplace</h1>
          <p className="text-neutral-400">Find available plastic deposits and claim batches for collection.</p>
        </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Truck className="w-5 h-5 text-blue-400" />}
          title="Active Batches"
          value="2"
          trend="In transit to Recycler"
        />
        <StatCard 
          icon={<Package className="w-5 h-5 text-emerald-400" />}
          title="Total Collected"
          value="145 kg"
          trend="+32kg this month"
        />
      </div>

      {/* Available Marketplace */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden glass-panel">
        <div className="px-6 py-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-neutral-400" /> Available for Collection
          </h2>
        </div>
        
        {availableLogs.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
             No plastics available for collection right now.
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/50">
            {availableLogs.map((log) => (
              <div key={log.id} className="p-6 flex items-center justify-between hover:bg-neutral-800/30 transition-colors">
                <div className="flexItems-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <Package className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{log.type} Plastic • {log.weight} kg</p>
                    <div className="flex items-center gap-2 text-sm text-neutral-400 mt-1">
                      <MapPin className="w-3 h-3" /> {log.location}
                      <span className="text-neutral-600">•</span>
                      <Clock className="w-3 h-3" /> {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleCollect(log.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg font-medium transition-colors"
                >
                  <Check className="w-4 h-4" /> Claim Batch
                </button>
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

"use client";

import { useState, useEffect } from "react";
import { Leaf, Award, Recycle } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ConsumerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  // Simulation: Setup mock user on mount
  useEffect(() => {
    setUser({
      name: "Alex Green",
      points: 45,
      role: "CONSUMER"
    });
    setLogs([
      { id: "1", type: "PET", weight: 2.5, timestamp: new Date(Date.now() - 86400000).toISOString(), isCollected: true },
      { id: "2", type: "HDPE", weight: 1.2, timestamp: new Date().toISOString(), isCollected: false }
    ]);
  }, []);

  return (
    <ProtectedRoute allowedRoles={["CONSUMER"]}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Consumer Dashboard</h1>
          <p className="text-neutral-400">Track your impact and earn rewards for responsible disposal.</p>
        </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Leaf className="w-5 h-5 text-emerald-400" />}
          title="Total Plastic Recycled"
          value="3.7 kg"
          trend="+1.2kg this week"
        />
        <StatCard 
          icon={<Award className="w-5 h-5 text-amber-400" />}
          title="Milestone Points"
          value={user?.points || 0}
          trend="5 points to next tier"
        />
        <StatCard 
          icon={<Recycle className="w-5 h-5 text-blue-400" />}
          title="Active Bins"
          value="1"
          trend="Awaiting collection"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden glass-panel">
        <div className="px-6 py-5 border-b border-neutral-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Recent Drops</h2>
          <span className="text-xs font-medium px-2.5 py-1 bg-neutral-800 rounded-full text-neutral-300">
            Real-time IoT Sync
          </span>
        </div>
        <div className="divide-y divide-neutral-800/50">
          {logs.map((log) => (
            <div key={log.id} className="p-6 flex items-center justify-between hover:bg-neutral-800/30 transition-colors">
              <div className="flexItems-center gap-4">
                <div className={`p-3 rounded-xl ${log.isCollected ? 'bg-neutral-800' : 'bg-emerald-500/10'}`}>
                  <Recycle className={`w-5 h-5 ${log.isCollected ? 'text-neutral-500' : 'text-emerald-400'}`} />
                </div>
                <div>
                  <p className="font-medium text-white">{log.type} Plastic Deposit</p>
                  <p className="text-sm text-neutral-400">Smart Bin #402 • {new Date(log.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white text-lg">{log.weight} kg</p>
                <div className="flex items-center gap-1.5 justify-end">
                  <div className={`w-2 h-2 rounded-full ${log.isCollected ? 'bg-neutral-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                  <p className="text-xs text-neutral-400">{log.isCollected ? 'Collected' : 'Pending'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
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
        <p className="text-sm text-emerald-400 font-medium">{trend}</p>
      </div>
    </div>
  );
}

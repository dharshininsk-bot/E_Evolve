"use client";

import React from "react";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Trophy, 
  Globe, 
  ShieldCheck, 
  ArrowUpRight, 
  Users, 
  Trash2,
  CircleDot
} from "lucide-react";

const impactData = [
  { name: "Week 1", weight: 240, credits: 2400 },
  { name: "Week 2", weight: 480, credits: 4800 },
  { name: "Week 3", weight: 620, credits: 6200 },
  { name: "Week 4", weight: 950, credits: 9500 },
  { name: "Week 5", weight: 1245, credits: 12458 },
];

const plasticTypes = [
  { name: "PET", value: 45, color: "#3b82f6" },
  { name: "HDPE", value: 25, color: "#f97316" },
  { name: "LDPE", value: 15, color: "#22c55e" },
  { name: "PP", value: 15, color: "#a855f7" },
];

export default function ImpactDashboard() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Plastic Diverted</p>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tighter">1,245.8 <span className="text-lg font-bold text-slate-400">kg</span></h2>
                <div className="mt-4 flex items-center text-green-600 text-sm font-bold bg-green-50 w-fit px-2 py-1 rounded-lg">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span>24% vs last month</span>
                </div>
            </div>
            <Globe className="absolute -bottom-4 -right-4 w-24 h-24 text-slate-50 group-hover:text-blue-50 transition-colors duration-500" />
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Circularized Value</p>
            <h2 className="text-4xl font-extrabold tracking-tighter">12,458 <span className="text-lg font-bold text-slate-500 uppercase">prc</span></h2>
            <div className="mt-4 flex items-center text-blue-400 text-xs font-bold uppercase tracking-widest bg-white/5 w-fit px-3 py-1.5 rounded-full border border-white/10">
                <ShieldCheck className="w-3 h-3 mr-2" />
                <span>Hedera Verified</span>
            </div>
            <Trophy className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5" />
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-1">
                <CircleDot className="w-3 h-3 text-blue-500 animate-pulse" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Collectors</p>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tighter">342</h2>
            <div className="mt-4 -space-x-2 flex">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">ID</div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">+31</div>
            </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-600/20">
            <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-1">CO2 Avoided</p>
            <h2 className="text-4xl font-extrabold tracking-tighter">2,860 <span className="text-lg font-bold text-blue-300">kg</span></h2>
            <div className="mt-4 text-xs font-medium text-blue-50">Equivalent to planting 128 trees this year.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-900">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold">Waste Diversion Growth</h3>
                    <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-semibold">Weekly Impact Trend • Verified by HCS</p>
                </div>
                <div className="flex space-x-2">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>Weight (kg)</span>
                    </div>
                </div>
            </div>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={impactData}>
                        <defs>
                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                        <Tooltip 
                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px 16px'}}
                            itemStyle={{fontWeight: 'bold'}}
                        />
                        <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorWeight)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Breakdown Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-8">
            <h3 className="text-xl font-bold">Plastic Breakdown</h3>
            <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={plasticTypes}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={8}
                            dataKey="value"
                        >
                            {plasticTypes.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={10} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                    <p className="text-xl font-bold text-slate-800">1.2T</p>
                </div>
            </div>
            
            <div className="space-y-3">
                {plasticTypes.map((type) => (
                    <div key={type.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition duration-300 group">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: type.color}} />
                            <span className="text-sm font-bold text-slate-700">{type.name}</span>
                        </div>
                        <span className="text-sm font-mono font-bold text-slate-900 group-hover:text-blue-600">{type.value}%</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

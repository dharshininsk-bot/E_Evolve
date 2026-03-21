"use client";

import React, { useState, useEffect } from "react";
import { Droplet, Award, TrendingUp, CheckCircle2, Package, MapPin, Clock, LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConsumerDashboard() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Region and Collectors State
  const [region, setRegion] = useState("Guindy");
  const [collectors, setCollectors] = useState([]);
  const [isFetchingCollectors, setIsFetchingCollectors] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "CONSUMER") {
      router.push(`/dashboard/${parsedUser.role.toLowerCase()}`);
      return;
    }
    setUser(parsedUser);
    fetchProfile(parsedUser.id);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const fetchProfile = async (userId) => {
    setIsLoading(true);
    try {
      const url = `/api/consumer/profile?userId=${userId}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
      }
    } catch (err) {
      console.error("Failed to fetch consumer profile", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCollectors = async () => {
      setIsFetchingCollectors(true);
      try {
        const res = await fetch(`/api/collectors?region=${encodeURIComponent(region)}`);
        const data = await res.json();
        if (data.success) {
          setCollectors(data.collectors || []);
        } else {
          setCollectors([]);
        }
      } catch (err) {
        console.error("Failed to fetch collectors", err);
        setCollectors([]);
      } finally {
        setIsFetchingCollectors(false);
      }
    };
    if (region) {
      fetchCollectors();
    }
  }, [region]);
  const stats = [
    { 
      label: "Plastic Diverted", 
      value: profile ? `${profile.stats.plasticDiverted.toFixed(1)} kg` : "0.0 kg", 
      icon: Droplet, 
      color: "text-blue-600", 
      bg: "bg-blue-100" 
    },
    { 
      label: "Points Earned", 
      value: profile ? `${profile.stats.creditsEarned} Points` : "0 Points", 

      icon: Award, 
      iconColor: "text-yellow-600", 
      bg: "bg-yellow-100" 
    },
    { 
      label: "Total Impact", 
      value: profile ? profile.stats.impact : "+0.0%", 
      icon: TrendingUp, 
      color: "text-green-600", 
      bg: "bg-green-100" 
    },
  ];

  const acceptedTypes = [
    { type: "PET", name: "Water Bottles", color: "bg-blue-500" },
    { type: "HDPE", name: "Milk Jugs", color: "bg-orange-500" },
    { type: "LDPE", name: "Plastic Bags", color: "bg-green-500" },
    { type: "PP", name: "Caps & Straws", color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Impact</h1>
          <p className="text-slate-500 mt-1 uppercase tracking-wider text-xs font-semibold">Individual Dashboard • Circular Reward System</p>
          {profile && (
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm font-semibold text-slate-600">Consumer ID:</span>
              <span className="font-mono text-sm bg-slate-100 text-slate-800 px-3 py-1 rounded border border-slate-200 shadow-sm">{profile.id}</span>
            </div>
          )}

        </div>
        
        {user && (
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-2 pr-4 rounded-2xl border border-slate-200/60 shadow-sm animate-in slide-in-from-right-4 duration-500">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-400 leading-none mb-1 uppercase tracking-tighter">Authenticated As</p>
              <p className="text-sm font-bold text-slate-800 leading-none">{user.email}</p>
            </div>
            <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block"></div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all group"
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color || stat.iconColor}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 uppercase">{isLoading ? "..." : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Find Collectors Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Find Local Collectors</h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">10 Points awarded automatically for every 1kg verified by a collector.</p>
          </div>
          <div className="w-full md:w-64">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center space-x-2 mb-2">
              <MapPin className="w-3 h-3" />
              <span>Select Region</span>
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {[ "Guindy", "Adyar", "Velachery", "Tambaram"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {isFetchingCollectors ? (
            <div className="py-8 text-center text-slate-500 text-sm font-bold animate-pulse">
              Finding collectors near {region}...
            </div>
          ) : collectors.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {collectors.map((c) => (
                <div key={c.id} className="p-4 border border-slate-200 rounded-xl flex flex-col space-y-3 bg-slate-50/50 hover:bg-slate-50 transition border-l-4 border-l-blue-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Collector ID</p>
                      <p className="font-mono text-xs font-bold text-slate-900 break-all">{c.id}</p>
                      <p className="text-xs text-slate-500 mt-1">{c.email}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded tracking-widest whitespace-nowrap">
                      Active
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                    <div className="flex items-center space-x-1 text-xs font-medium text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span>{c.collectorProfile?.collectionTime || "Contact for time"}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs font-medium text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                      <Package className="w-3 h-3 text-orange-500" />
                      <span>{c.collectorProfile?.wasteType || "All Plastics"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="py-8 text-center text-slate-500 text-sm font-medium">
               No collectors found in {region}.
             </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Milestone Progress */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800">Recycling Milestone</h3>
            <span className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">
                {profile?.milestones && profile.milestones.length > 0 ? `Level ${profile.milestones.length} Hero` : "Getting Started"}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-500 underline decoration-blue-500/30">
                Next Target: {(profile?.milestones?.length || 0) * 10 + 10}kg
              </span>
              <span className="text-slate-900">{profile ? profile.stats.plasticDiverted.toFixed(1) : "0.0"} / {(profile?.milestones?.length || 0) * 10 + 10} kg</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000" 
                style={{ width: `${Math.min(100, (profile?.stats.plasticDiverted || 0) / ((profile?.milestones?.length || 0) * 10 + 10) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 flex flex-col space-y-3 border border-slate-200">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <h4 className="text-sm font-bold text-slate-800">Your Rewards</h4>
            </div>
            {profile?.milestones && profile.milestones.length > 0 ? (
              <div className="space-y-2">
                {profile.milestones.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{m.totalWeight}kg Reached</span>
                    <span className="text-xs font-bold font-mono text-blue-600 px-2 py-0.5 bg-blue-50 rounded">{m.couponCode}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Reach <span className="text-slate-900 font-bold">10kg</span> to unlock your first unique <span className="text-slate-900 font-bold font-mono text-[10px]">EVOLVE-SAVE</span> discount code.
              </p>
            )}
          </div>
        </div>

        {/* Accepted Types */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white space-y-6">
          <h3 className="text-xl font-bold">Accepted Materials</h3>
          <div className="grid grid-cols-2 gap-4">
            {acceptedTypes.map((item) => (
              <div key={item.type} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <div>
                  <p className="text-sm font-bold leading-none">{item.type}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">{item.name}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

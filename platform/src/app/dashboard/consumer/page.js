"use client";

import React, { useState, useEffect } from "react";
import { Droplet, Award, TrendingUp, CheckCircle2, Package } from "lucide-react";
import ProfileSwitcher from "@/components/ProfileSwitcher";

export default function ConsumerDashboard() {
  const [profile, setProfile] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId) => {
    setIsLoading(true);
    try {
      const url = userId ? `/api/consumer/profile?userId=${userId}` : "/api/consumer/profile";
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
    if (selectedUserId) {
      fetchProfile(selectedUserId);
    }
  }, [selectedUserId]);

  const stats = [
    { 
      label: "Plastic Diverted", 
      value: profile ? `${profile.stats.plasticDiverted.toFixed(1)} kg` : "0.0 kg", 
      icon: Droplet, 
      color: "text-blue-600", 
      bg: "bg-blue-100" 
    },
    { 
      label: "Credits Earned", 
      value: profile ? `${profile.stats.creditsEarned} PRC` : "0 PRC", 
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Impact</h1>
          <p className="text-slate-500 mt-1 uppercase tracking-wider text-xs font-semibold">Individual Dashboard • Circular Reward System</p>
        </div>
        <ProfileSwitcher role="CONSUMER" onProfileChange={setSelectedUserId} />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Milestone Progress */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800">Recycling Milestone</h3>
            <span className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">
                {profile?.stats.plasticDiverted >= 10 ? "Eco Master" : "Level 1 Hero"}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-500 underline decoration-blue-500/30">Next Reward: Eco-Coupon</span>
              <span className="text-slate-900">{profile ? profile.stats.plasticDiverted.toFixed(1) : "0.0"} / 10 kg</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000" 
                style={{ width: `${Math.min(100, (profile?.stats.plasticDiverted || 0) / 10 * 100)}%` }} 
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 flex items-start space-x-3 border border-slate-200">
            <Award className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {profile?.stats.plasticDiverted >= 10 ? (
                  <>Congratulations! You've unlocked the <span className="text-slate-900 font-bold font-mono">EVOLVE-SAVE-20</span> discount code.</>
              ) : (
                  <>Reach 10kg to unlock a unique <span className="text-slate-900 font-bold font-mono">EVOLVE-SAVE-20</span> discount code for use with our Producer partners.</>
              )}
            </p>
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
          <div className="pt-2">
            <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-200 transition">
              Find Collection Point
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

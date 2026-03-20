"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Search, Shovel, ShieldCheck, MapPin, ExternalLink, Filter, Factory } from "lucide-react";
import ProfileSwitcher from "@/components/ProfileSwitcher";

export default function ProducerDashboard() {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [profile, setProfile] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(null);

  const fetchData = async (userId) => {
      setIsLoading(true);
      try {
          const query = userId ? `?userId=${userId}` : "";
          const profRes = await fetch(`/api/producer/profile${query}`);
          const profData = await profRes.json();
          if (profData.success) setProfile(profData.profile);

          const listRes = await fetch("/api/marketplace/listings");
          const listData = await listRes.json();
          if (listData.success) setListings(listData.listings);
      } catch (err) {
          console.error("Failed to fetch data", err);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchData(selectedUserId);
    }
  }, [selectedUserId]);

  const handlePurchase = async (recyclerId, amount) => {
      if (!profile) return;
      setIsPurchasing(recyclerId);
      try {
          const res = await fetch("/api/marketplace/purchase", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  producerId: profile.id,
                  recyclerId,
                  amount
              })
          });
          const data = await res.json();
          if (data.success) {
              alert("Purchase successful!");
              fetchData(selectedUserId);
          } else {
              alert("Purchase failed: " + data.error);
          }
      } catch (err) {
          alert("Error purchasing credits");
      } finally {
          setIsPurchasing(null);
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Compliance & Sourcing</h1>
          <p className="text-slate-500 mt-1 uppercase tracking-wider text-xs font-semibold">Producer Dashboard • ESG Token Marketplace</p>
        </div>
        <ProfileSwitcher role="PRODUCER" onProfileChange={setSelectedUserId} />
      </div>

      {/* Obligation Tracker */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
            <div>
          <h3 className="text-xl font-bold text-slate-800">2026 Reselling Obligation</h3>
          <p className="text-sm text-slate-500 mt-1">Goal: 5,000 kg Plastic Neutrality</p>
          </div>
          <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full uppercase tracking-widest">In Progress</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-500">Verified Credits Purchased</span>
            <span className="text-slate-900">{profile ? profile.creditsPurchased : "..."} / 5,000 kg</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-gradient-to-r from-slate-700 to-slate-900 transition-all duration-1000" 
              style={{ width: `${Math.min(100, (profile?.creditsPurchased || 0) / 5000 * 100)}%` }} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl w-fit">
                <button 
                  onClick={() => setActiveTab("marketplace")}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition ${activeTab === "marketplace" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                    Marketplace
                </button>
                <button 
                  onClick={() => setActiveTab("trace")}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition ${activeTab === "trace" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                    Deep Trace
                </button>
            </div>

            {activeTab === "marketplace" ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div className="flex items-center space-x-2">
                            <ShoppingBag className="w-5 h-5 text-slate-900" />
                            <h3 className="text-lg font-bold">Available Credits</h3>
                        </div>
                        <Filter className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="divide-y divide-slate-100">
                        {isLoading ? (
                            <div className="p-8 text-center text-slate-500">Loading marketplace...</div>
                        ) : listings.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No credits currently available.</div>
                        ) : listings.map((listing) => (
                            <div key={listing.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                                <div className="flex items-center space-x-6">
                                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                                        <Shovel className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <p className="text-lg font-bold text-slate-900">{listing.prcBalance} PRC Tokens</p>
                                            <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-50" />
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">Verified Source: {listing.businessName} ({listing.location})</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-slate-900">₹{(listing.prcBalance * 0.50).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    <button 
                                        onClick={() => handlePurchase(listing.userId, listing.prcBalance)}
                                        disabled={isPurchasing !== null}
                                        className="mt-2 bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition disabled:opacity-50"
                                    >
                                        {isPurchasing === listing.userId ? "Purchasing..." : "Purchase All"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
                    <div className="flex items-center space-x-3 text-slate-900">
                        <Search className="w-6 h-6" />
                        <h3 className="text-xl font-bold">Trace Plastic Provenance</h3>
                    </div>
                    <p className="text-slate-500 text-sm">Enter a Token ID or HCS Sequence to see the visual journey of the plastic.</p>
                    <div className="flex space-x-2">
                        <input 
                            type="text" 
                            placeholder="e.g. 0.0.123456" 
                            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button className="bg-slate-900 text-white px-8 rounded-xl font-bold">Track</button>
                    </div>

                    <div className="pt-8 space-y-8">
                        {[
                            { step: "Consumer Logged", time: "Oct 12, 09:42", detail: "15kg PET at Point #4", icon: MapPin },
                            { step: "Collector Verified", time: "Oct 12, 14:20", detail: "HCS Msg #342113", icon: ShieldCheck },
                            { step: "Recycler Processed", time: "Oct 13, 11:05", detail: "Converted to 150 PRC Tokens", icon: Factory },
                        ].map((event, idx) => (
                            <div key={idx} className="flex space-x-6 relative">
                                {idx !== 2 && <div className="absolute left-[13px] top-[30px] bottom-[-20px] w-0.5 bg-slate-100" />}
                                <div className="w-7 h-7 bg-slate-100 border-2 border-slate-200 rounded-full flex items-center justify-center relative z-10">
                                    <event.icon className="w-3 h-3 text-slate-600" />
                                </div>
                                <div className="flex-1 pb-4">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-bold text-slate-900 underline decoration-slate-200">{event.step}</p>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase">{event.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">{event.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
            <div className="bg-blue-600 rounded-2xl p-8 text-white space-y-6 shadow-xl shadow-blue-600/20">
                <ShieldCheck className="w-12 h-12 opacity-50" />
                <h3 className="text-xl font-bold">Compliance Portal</h3>
                <p className="text-sm text-blue-100 leading-relaxed font-medium">
                    All credits on this marketplace are secondary-verified using Hedera Consensus Service.
                </p>
                <div className="flex items-center space-x-2 text-xs font-bold bg-blue-500 px-3 py-2 rounded-lg w-fit">
                    <ExternalLink className="w-3 h-3" />
                    <span>View Audit Policy</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

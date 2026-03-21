"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Shovel, ShieldCheck, ExternalLink, Filter, LogOut, User as UserIcon, Info, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProducerDashboard() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(null);
  const [expandedSourcing, setExpandedSourcing] = useState(null); // recyclerId
  const [sourcingData, setSourcingData] = useState({}); // { recyclerId: { data, loading } }
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "PRODUCER") {
      router.push(`/dashboard/${parsedUser.role.toLowerCase()}`);
      return;
    }
    setUser(parsedUser);
    fetchData(parsedUser.id);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

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

  const fetchSourcingOverview = async (recyclerId) => {
    if (sourcingData[recyclerId]) return;

    setSourcingData(prev => ({ ...prev, [recyclerId]: { loading: true } }));
    try {
        const res = await fetch(`/api/marketplace/sourcing-overview?recyclerId=${recyclerId}`);
        const data = await res.json();
        if (data.success) {
            setSourcingData(prev => ({ ...prev, [recyclerId]: { data: data.overview, loading: false } }));
        }
    } catch (err) {
        console.error("Failed to fetch sourcing", err);
        setSourcingData(prev => ({ ...prev, [recyclerId]: { loading: false, error: true } }));
    }
  };

  const toggleSourcing = (recyclerId) => {
    if (expandedSourcing === recyclerId) {
        setExpandedSourcing(null);
    } else {
        setExpandedSourcing(recyclerId);
        fetchSourcingOverview(recyclerId);
    }
  };

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
              if (user) fetchData(user.id);
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
        
        {user && (
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-2 pr-4 rounded-2xl border border-slate-200/60 shadow-sm animate-in slide-in-from-right-4 duration-500">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <UserIcon className="w-5 h-5 flex-shrink-0" />
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

      {/* Obligation Tracker */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
            <div>
          <h3 className="text-xl font-bold text-slate-800">2026 Neutrality Goal</h3>
          <p className="text-sm text-slate-500 mt-1">Target: 5,000 kg Plastic Offset</p>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-widest">ESG Verified</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-500">Verified Credits Purchased</span>
            <span className="text-slate-900">{profile ? profile.creditsPurchased : "..."} / 5,000 kg</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-1000" 
              style={{ width: `${Math.min(100, (profile?.creditsPurchased || 0) / 5000 * 100)}%` }} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-5 h-5 text-slate-900" />
                        <h3 className="text-lg font-bold">Marketplace Listings</h3>
                    </div>
                    <Filter className="w-5 h-5 text-slate-400" />
                </div>
                <div className="divide-y divide-slate-100">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Connecting to Ledger...</span>
                        </div>
                    ) : listings.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 font-medium">No plastic credits currently listed for sale.</div>
                    ) : listings.map((listing) => (
                        <div key={listing.id} className="group">
                            <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition">
                                <div className="flex items-center space-x-6">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-blue-200 transition">
                                        <Shovel className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <p className="text-lg font-bold text-slate-900">{listing.prcBalance} PRC Tokens</p>
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <p className="text-xs text-slate-500 font-semibold">{listing.businessName} • {listing.location}</p>
                                        <button 
                                            onClick={() => toggleSourcing(listing.userId)}
                                            className="mt-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:text-blue-800 transition"
                                        >
                                            <Info className="w-3 h-3" />
                                            {expandedSourcing === listing.userId ? "Hide Proof of Source" : "View Proof of Source"}
                                            {expandedSourcing === listing.userId ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="mb-2">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Purchase Price</p>
                                        <p className="text-xl font-bold text-slate-900">₹{(listing.prcBalance * 0.50).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <button 
                                        onClick={() => handlePurchase(listing.userId, listing.prcBalance)}
                                        disabled={isPurchasing !== null}
                                        className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95 disabled:opacity-50"
                                    >
                                        {isPurchasing === listing.userId ? "Processing..." : "Purchase All"}
                                    </button>
                                </div>
                            </div>

                            {/* Sourcing Detail Expansion */}
                            {expandedSourcing === listing.userId && (
                                <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                            Transparent Sourcing Summary
                                        </h4>
                                        
                                        {sourcingData[listing.userId]?.loading ? (
                                            <div className="py-4 flex items-center justify-center gap-2 text-slate-400 text-sm">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Loading provenance chain...
                                            </div>
                                        ) : sourcingData[listing.userId]?.data?.length > 0 ? (
                                            <div className="space-y-3">
                                                {sourcingData[listing.userId].data.map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                                <UserIcon className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-slate-700">{item.collectorEmail}</p>
                                                                <p className="text-[10px] text-slate-400 font-medium">Authorized Collector</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-slate-900">{item.totalWeight}kg</p>
                                                            <p className="text-[10px] text-slate-400 uppercase font-bold">{item.logsCount} Collections</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500 italic py-2 text-center">No recent collection data available for this recycler.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-12 translate-x-12 blur-3xl group-hover:bg-blue-500/20 transition-all" />
                <ShieldCheck className="w-12 h-12 text-emerald-500 opacity-80" />
                <h3 className="text-xl font-bold">Compliance Standard</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    All credits on this marketplace are secondary-verified using Hedera Consensus Service (HCS), ensuring immutability and ESG compliance.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}

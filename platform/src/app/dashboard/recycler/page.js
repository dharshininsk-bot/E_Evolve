"use client";

import React, { useState, useEffect } from "react";
import { 
  Factory, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw,
  Clock,
  Dna,
  Package,
  MapPin,
  Check,
  Settings,
  Save,
  IndianRupee
} from "lucide-react";
import ProfileSwitcher from "@/components/ProfileSwitcher";


export default function RecyclerDashboard() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [balance, setBalance] = useState(null); // null means 'Connecting...'
  const [userMintedTotal, setUserMintedTotal] = useState(0);
  const [tokenId, setTokenId] = useState("0.0.8229487");
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(null); // stores logId of log being minted
  const [isAccepting, setIsAccepting] = useState(null); // stores logId being accepted
  
  // Profile & Rates state
  const [profile, setProfile] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editLocation, setEditLocation] = useState("");
  const [editRates, setEditRates] = useState({
    PET: "",
    HDPE: "",
    LDPE: "",
    PP: ""
  });


  const fetchData = async (userId) => {
    setIsLoading(true);
    try {
      const query = userId ? `?userId=${userId}` : "";
      
      // Fetch verified logs for minting
      const htsResp = await fetch(`/api/hedera/hts${query}`);
      const htsData = await htsResp.json();
      if (htsData.logs) setLogs(htsData.logs);
      if (htsData.tokenBalance !== undefined) setBalance(htsData.tokenBalance?.toString());
      if (htsData.userMintedTotal !== undefined) setUserMintedTotal(htsData.userMintedTotal);
      if (htsData.tokenId) setTokenId(htsData.tokenId);

      // Fetch incoming requests
      const reqResp = await fetch(`/api/logs/recycler${query}`);
      const reqData = await reqResp.json();
      if (reqData.success && reqData.logs) {
        setIncomingRequests(reqData.logs);
      }

      // Fetch profile
      const profResp = await fetch(`/api/recycler/profile${query}`);
      const profData = await profResp.json();
      if (profData.success) {
        setProfile(profData.profile);
        setEditLocation(profData.profile.location);
        setEditRates(JSON.parse(profData.profile.rates));
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (selectedUserId) {
      fetchData(selectedUserId);
    }
  }, [selectedUserId]);

  const handleMint = async (logId) => {
    setIsMinting(logId);
    try {
      const resp = await fetch("/api/hedera/hts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId })
      });
      const result = await resp.json();
      
      if (result.success) {
        setLogs(prev => prev.filter(l => l.id !== logId));
        fetchData(); 
        alert(`Successfully minted ${result.mintedAmount} Recycling Credits!`);
      } else {
        alert("Minting failed: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error connecting to HTS Gateway");
    } finally {
      setIsMinting(null);
    }
  };

  const handleAcceptRequest = async (logId) => {
    setIsAccepting(logId);
    try {
      const resp = await fetch("/api/logs/accept", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId })
      });
      const result = await resp.json();

      if (result.success) {
        setIncomingRequests(prev => prev.filter(req => req.id !== logId));
        // We don't need to move it to the minting queue here, as it first needs Collector HCS sync
      } else {
        alert("Failed to accept request: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error accepting request");
    } finally {
      setIsAccepting(null);
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const resp = await fetch("/api/recycler/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: editLocation,
          rates: editRates
        })
      });
      const result = await resp.json();
      if (result.success) {
        setProfile(result.profile);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error updating profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (

    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Recycler Dashboard</h1>
          <p className="text-slate-500 mt-1 uppercase tracking-wider text-xs font-semibold">Incoming Requests & Credit Minting</p>
        </div>
        <div className="flex items-center space-x-3">
          <ProfileSwitcher role="RECYCLER" onProfileChange={setSelectedUserId} />
          <button 
            onClick={() => {
              setBalance(null);
              fetchData(selectedUserId);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Dashboard</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stats Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Total Minted</h3>
              <p className="text-4xl font-bold flex items-baseline">
                {isLoading ? (
                  <span className="text-slate-500 animate-pulse text-2xl">Updating...</span>
                ) : (
                  <>
                    {userMintedTotal} <span className="text-xs ml-2 text-slate-400">CREDITS</span>
                  </>
                )}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-green-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>On-Chain Verified</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Treasury: {balance || '0'}</div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Coins className="w-20 h-20" />
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-4">Available to Sell</h3>
              <p className="text-4xl font-bold flex items-baseline text-emerald-900">
                {profile === null ? (
                  <span className="text-emerald-500 animate-pulse text-2xl">Loading...</span>
                ) : (
                  <>
                    {profile.prcBalance} <span className="text-xs ml-2 text-emerald-700">PRC</span>
                  </>
                )}
              </p>
              <div className="mt-6 flex items-center space-x-2 text-emerald-600 text-xs font-bold">
                <IndianRupee className="w-4 h-4" />
                <span>Ready for Marketplace</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Network Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-400">HTS Latency</span>
                <span className="text-slate-800 font-mono">2.4s</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-400">Token ID</span>
                <span className="text-blue-600 font-mono text-xs">{tokenId}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-400">Treasury</span>
                <span className="text-slate-800 font-mono text-xs">Active</span>
              </div>
            </div>
          </div>

          {/* Settings / Profile Management */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in slide-in-from-left duration-500">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center space-x-3">
              <Settings className="w-5 h-5 text-slate-600" />
              <h3 className="font-bold text-slate-800">Recycler Settings</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operating Area</label>
                <select 
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="Adyar">Adyar</option>
                  <option value="Guindy">Guindy</option>
                  <option value="Velachery">Velachery</option>
                  <option value="Tambaram">Tambaram</option>
                  <option value="Teynampet">Teynampet</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Pricing (₹ per kg)</label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(editRates).map(type => (
                    <div key={type} className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400">{type}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                        <input 
                          type="number"
                          value={editRates[type]}
                          onChange={(e) => setEditRates(prev => ({ ...prev, [type]: parseFloat(e.target.value) || 0 }))}
                          className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition active:scale-[0.98] disabled:opacity-50"
              >
                {isSavingProfile ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Profile</span>
              </button>
            </div>
          </div>
        </div>


        {/* Main Lists Column */}
        <div className="lg:col-span-3 space-y-8">

          {/* Incoming Requests Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-blue-50 border-b border-blue-100 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Incoming Pickup Requests</h3>
                  <p className="text-xs text-slate-500 font-medium">Collectors waiting for your acceptance</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {incomingRequests.length} NEW
              </span>
            </div>

            <div className="divide-y divide-slate-100 min-h-[200px]">
              {isLoading ? (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-4">
                    <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                  </div>
              ) : incomingRequests.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <p className="text-sm font-medium italic">No new pickup requests right now.</p>
                </div>
              ) : (
                incomingRequests.map((req) => (
                  <div key={req.id} className="p-6 hover:bg-slate-50 transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                            <h4 className="text-lg font-bold text-slate-900">{req.weight}kg <span className="text-slate-500">{req.plasticType}</span></h4>
                            <span className="text-[10px] font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded leading-none">PENDING</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                             <div className="flex items-center space-x-1">
                               <MapPin className="w-4 h-4" />
                               <span>{req.district}, {req.state} ({req.pincode})</span>
                             </div>
                             <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                             <div>
                               From: {req.collector?.email || 'Unknown Collector'}
                             </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAcceptRequest(req.id)}
                        disabled={isAccepting === req.id}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50"
                      >
                        {isAccepting === req.id ? (
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                           <Check className="w-4 h-4" />
                        )}
                        <span>Accept Request</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Minting Queue Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Factory className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Minting Queue</h3>
                  <p className="text-xs text-slate-500 font-medium">Verified bags ready for credit generation</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {logs.length} READY
              </span>
            </div>

            <div className="divide-y divide-slate-100 min-h-[400px]">
              {isLoading ? (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-8 h-8 border-3 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
                  <p className="text-sm font-medium">Scanning ledger for verified logs...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="p-4 bg-slate-50 rounded-full">
                    <Clock className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-sm font-medium italic">No verified logs waiting in the queue.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-8 hover:bg-slate-50 transition group">
                    <div className="flex flex-col md:row md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start space-x-6">
                        <div className="relative">
                          <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-white transition shadow-sm">
                            <Dna className="w-6 h-6 text-slate-600" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                             <h4 className="text-lg font-bold text-slate-900">{log.weight}kg <span className="text-slate-400">{log.plasticType}</span></h4>
                             <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded leading-none">ON-CHAIN VERIFIED</span>
                          </div>
                          <div className="flex items-center space-x-4 mt-2">
                             <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                               <RefreshCw className="w-3 h-3" />
                               <span>HCS Seq: {log.hcsSequenceNumber}</span>
                             </div>
                             <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                             <div className="text-xs text-slate-500 font-mono">
                               ID: {log.id.substring(0, 8)}...
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block mr-4">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Estimated Yield</p>
                          <p className="text-sm font-bold text-emerald-600">+{Math.floor(log.weight)} Credits</p>
                        </div>
                        <button
                          onClick={() => handleMint(log.id)}
                          disabled={isMinting !== null}
                          className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                        >
                          {isMinting === log.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Minting...</span>
                            </>
                          ) : (
                            <>
                              <Coins className="w-4 h-4" />
                              <span>Mint Credits</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

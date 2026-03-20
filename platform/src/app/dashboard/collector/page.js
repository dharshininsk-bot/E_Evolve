"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import { Trash2, Scale, Package, Send, CheckCircle2, ChevronRight, Hash, Radio, MapPin, Factory, UserPlus } from "lucide-react";
=======
import { Trash2, Scale, Package, Send, CheckCircle2, ChevronRight, Hash, Radio, MapPin, Factory } from "lucide-react";
>>>>>>> 96c684204a85d8db483cbbbe193125389cbff8ed
import ProfileSwitcher from "@/components/ProfileSwitcher";

export default function CollectorDashboard() {
  const router = useRouter();
<<<<<<< HEAD
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("collect"); // "collect" | "request"
  
  // Consumer Collection State
  const [consumerId, setConsumerId] = useState("");
  const [collectWeight, setCollectWeight] = useState("");
  const [collectPlasticType, setCollectPlasticType] = useState("PET");
  const [isCollecting, setIsCollecting] = useState(false);
  
  // Request Pickup State
  const [weight, setWeight] = useState("");
  const [plasticType, setPlasticType] = useState("PET");
  const [stateName, setStateName] = useState("Tamil Nadu");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
=======
  const [weight, setWeight] = useState("");
  const [plasticType, setPlasticType] = useState("PET");
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  // Location State
  const [stateName, setStateName] = useState("Tamil Nadu");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  
  // Recycler State
>>>>>>> 96c684204a85d8db483cbbbe193125389cbff8ed
  const [recyclers, setRecyclers] = useState([]);
  const [selectedRecycler, setSelectedRecycler] = useState("");
  
  // Action State
  const [isRequesting, setIsRequesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncingLogId, setSyncingLogId] = useState(null);
  const [result, setResult] = useState(null);
  
  // Logs Feed State
  const [logs, setLogs] = useState([]);

<<<<<<< HEAD
=======
  // Fetch logs on load
>>>>>>> 96c684204a85d8db483cbbbe193125389cbff8ed
  const fetchLogs = async (userId) => {
    try {
      const url = userId ? `/api/logs/collector?userId=${userId}` : "/api/logs/collector";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchLogs(selectedUserId);
    }
  }, [selectedUserId]);

<<<<<<< HEAD
=======
  // Fetch recyclers when district changes
>>>>>>> 96c684204a85d8db483cbbbe193125389cbff8ed
  useEffect(() => {
    const fetchRecyclers = async () => {
      if (district) {
        try {
          const res = await fetch(`/api/recyclers?state=${stateName}&district=${district}`);
          const data = await res.json();
          if (data.success) {
            setRecyclers(data.recyclers);
            if (data.recyclers.length > 0) {
              setSelectedRecycler(data.recyclers[0].user.id);
            } else {
              setSelectedRecycler("");
            }
          }
        } catch (err) {
          console.error("Failed to fetch recyclers", err);
        }
      } else {
        setRecyclers([]);
        setSelectedRecycler("");
      }
    };
    fetchRecyclers();
  }, [stateName, district]);

<<<<<<< HEAD
  const handleCollectFromConsumer = async (e) => {
    e.preventDefault();
    setIsCollecting(true);
    setResult(null);

    try {
      const response = await fetch("/api/logs/collect-from-consumer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consumerId,
          weight: collectWeight,
          plasticType: collectPlasticType,
          collectorId: selectedUserId
        }),
      });

      const data = await response.json();
      if (data.success) {
        setConsumerId("");
        setCollectWeight("");
        alert(`Success! 10 points per kg (${parseFloat(collectWeight)*10} total points) credited to the consumer.`);
        fetchLogs(selectedUserId); 
      } else {
        alert("Failed to log collection: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error processing request");
    } finally {
      setIsCollecting(false);
    }
  };

=======
>>>>>>> 96c684204a85d8db483cbbbe193125389cbff8ed
  const handleRequestPickup = async (e) => {
    e.preventDefault();
    if (!selectedRecycler) {
        alert("Please select a recycler before requesting pickup.");
        return;
    }
    setIsRequesting(true);
    setResult(null);

    try {
      const response = await fetch("/api/logs/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight,
          plasticType,
          state: stateName,
          district,
          pincode,
          recyclerId: selectedRecycler
        }),
      });

      const data = await response.json();
      if (data.success) {
        setWeight("");
<<<<<<< HEAD
        fetchLogs(selectedUserId);
=======
        fetchLogs(); // Reload logs
>>>>>>> 96c684204a85d8db483cbbbe193125389cbff8ed
      } else {
        alert("Failed to request pickup: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error processing request");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSubmitToLedger = async (logId) => {
    setIsSyncing(true);
    setSyncingLogId(logId);
    setResult(null);

    try {
      const response = await fetch("/api/hedera/hcs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId }),
      });

      const data = await response.json();
      if (data.success) {
        setResult({
          sequenceNumber: data.sequenceNumber,
          transactionId: data.transactionId,
          logId: data.logId,
          weight: logs.find(l => l.id === logId)?.weight,
          type: logs.find(l => l.id === logId)?.plasticType,
        });
<<<<<<< HEAD
        fetchLogs(selectedUserId); 
=======
        fetchLogs(); 
>>>>>>> 96c684204a85d8db483cbbbe193125389cbff8ed
        router.refresh(); 
      } else {
        alert("Failed to sync to ledger: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to ledger");
    } finally {
      setIsSyncing(false);
      setSyncingLogId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Marketplace Hub</h1>
          <p className="text-slate-500 mt-1 uppercase tracking-wider text-xs font-semibold">Collector Dashboard • Hedera HCS Gateway</p>
        </div>
        <ProfileSwitcher role="COLLECTOR" onProfileChange={setSelectedUserId} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
<<<<<<< HEAD
            <div className="flex border-b border-slate-200 bg-slate-50">
              <button 
                onClick={() => setActiveTab("collect")}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center space-x-2 transition ${activeTab === "collect" ? "text-blue-600 bg-white border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Log Consumer Collection</span>
              </button>
              <button 
                onClick={() => setActiveTab("request")}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center space-x-2 transition ${activeTab === "request" ? "text-blue-600 bg-white border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Request Pickup</span>
              </button>
            </div>

            {activeTab === "collect" && (
                <form onSubmit={handleCollectFromConsumer} className="p-8 space-y-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Log Consumer Collection</h3>
                    <p className="text-xs text-slate-500 font-medium">Verify consumer waste and credit points instantly (1kg = 10 points).</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                      <Hash className="w-4 h-4" />
                      <span>Consumer ID</span>
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isCollecting}
                      value={consumerId}
                      onChange={(e) => setConsumerId(e.target.value)}
                      placeholder="e.g. clabc123..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition outline-none text-lg font-mono disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 pb-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                        <Scale className="w-4 h-4" />
                        <span>Weight (kg)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        disabled={isCollecting}
                        value={collectWeight}
                        onChange={(e) => setCollectWeight(e.target.value)}
                        placeholder="e.g. 5.0"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition outline-none text-lg font-medium disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                        <Package className="w-4 h-4" />
                        <span>Plastic Type</span>
                      </label>
                      <select
                        value={collectPlasticType}
                        disabled={isCollecting}
                        onChange={(e) => setCollectPlasticType(e.target.value)}
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
                    disabled={isCollecting || !consumerId || !collectWeight}
                    className="w-full bg-slate-900 text-white rounded-xl py-4 flex items-center justify-center space-x-3 hover:bg-slate-800 transition active:scale-[0.98] disabled:opacity-50 font-bold text-lg"
                  >
                    {isCollecting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Verify & Credit Points</span>
                      </>
                    )}
                  </button>
                </form>
            )}

            {activeTab === "request" && (
                <form onSubmit={handleRequestPickup} className="p-8 space-y-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Request Pickup</h3>
                    <p className="text-xs text-slate-500 font-medium">Match with local recyclers for best rates on accumulated waste.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 pb-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                        <Scale className="w-4 h-4" />
                        <span>Weight (kg)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        disabled={isRequesting}
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
                        disabled={isRequesting}
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

                  {/* Location Picker */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>Pickup Location</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500">State</label>
                            <select 
                                value={stateName} 
                                onChange={(e) => setStateName(e.target.value)}
                                disabled={isRequesting}
                                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white text-sm"
                            >
                                <option value="Tamil Nadu">Tamil Nadu</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500">District / Area</label>
                            <select 
                                value={district} 
                                onChange={(e) => setDistrict(e.target.value)}
                                required
                                disabled={isRequesting}
                                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white text-sm"
                            >
                                <option value="" disabled>Select Area</option>
                                <option value="Adyar">Adyar</option>
                                <option value="Guindy">Guindy</option>
                                <option value="Velachery">Velachery</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500">Pincode</label>
                            <input
                                type="text"
                                required
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                disabled={isRequesting}
                                placeholder="e.g. 600020"
                                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                            />
                        </div>
                    </div>
                  </div>

                  {/* Recycler Matcher */}
                  {district && (
                    <div className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                        <h4 className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                            <Factory className="w-4 h-4 text-blue-600" />
                            <span>Available Recyclers Nearby</span>
                        </h4>
                        {recyclers.length === 0 ? (
                            <p className="text-sm text-slate-500 italic">No registered recyclers found in {district}.</p>
                        ) : (
                            <div className="space-y-3">
                                {recyclers.map(r => {
                                    const rates = r.rates ? JSON.parse(r.rates) : {};
                                    const rateForType = rates[plasticType];
                                    return (
                                        <label key={r.id} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${selectedRecycler === r.user.id ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 bg-white hover:border-slate-400'}`}>
                                            <div className="flex items-center space-x-3">
                                                <input 
                                                    type="radio" 
                                                    name="recycler" 
                                                    value={r.user.id} 
                                                    checked={selectedRecycler === r.user.id}
                                                    onChange={() => setSelectedRecycler(r.user.id)}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <div>
                                                    <div className="font-bold text-slate-800">{r.businessName}</div>
                                                    <div className="text-xs text-slate-500">{r.location}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-emerald-600">
                                                    {rateForType ? `₹${rateForType}/kg` : 'Rate TBD'}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase">For {plasticType}</div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isRequesting || recyclers.length === 0}
                    className="w-full bg-slate-900 text-white rounded-xl py-4 flex items-center justify-center space-x-3 hover:bg-slate-800 transition active:scale-[0.98] disabled:opacity-50 font-bold text-lg mt-6"
                  >
                    {isRequesting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Requesting Pickup...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Request Pickup</span>
                      </>
                    )}
                  </button>
                </form>
            )}
=======
            <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trash2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Request Pickup</h3>
                <p className="text-xs text-slate-500 font-medium">Match with local recyclers for best rates</p>
              </div>
            </div>

            <form onSubmit={handleRequestPickup} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 pb-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                    <Scale className="w-4 h-4" />
                    <span>Weight (kg)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    disabled={isRequesting}
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
                    disabled={isRequesting}
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

              {/* Location Picker */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Pickup Location</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500">State</label>
                        <select 
                            value={stateName} 
                            onChange={(e) => setStateName(e.target.value)}
                            disabled={isRequesting}
                            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white text-sm"
                        >
                            <option value="Tamil Nadu">Tamil Nadu</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500">District / Area</label>
                        <select 
                            value={district} 
                            onChange={(e) => setDistrict(e.target.value)}
                            required
                            disabled={isRequesting}
                            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white text-sm"
                        >
                            <option value="" disabled>Select Area</option>
                            <option value="Adyar">Adyar</option>
                            <option value="Guindy">Guindy</option>
                            <option value="Velachery">Velachery</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500">Pincode</label>
                        <input
                            type="text"
                            required
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            disabled={isRequesting}
                            placeholder="e.g. 600020"
                            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                        />
                    </div>
                </div>
              </div>

              {/* Recycler Matcher */}
              {district && (
                <div className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    <h4 className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                        <Factory className="w-4 h-4 text-blue-600" />
                        <span>Available Recyclers Nearby</span>
                    </h4>
                    {recyclers.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">No registered recyclers found in {district}.</p>
                    ) : (
                        <div className="space-y-3">
                            {recyclers.map(r => {
                                const rates = r.rates ? JSON.parse(r.rates) : {};
                                const rateForType = rates[plasticType];
                                return (
                                    <label key={r.id} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${selectedRecycler === r.user.id ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 bg-white hover:border-slate-400'}`}>
                                        <div className="flex items-center space-x-3">
                                            <input 
                                                type="radio" 
                                                name="recycler" 
                                                value={r.user.id} 
                                                checked={selectedRecycler === r.user.id}
                                                onChange={() => setSelectedRecycler(r.user.id)}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <div>
                                                <div className="font-bold text-slate-800">{r.businessName}</div>
                                                <div className="text-xs text-slate-500">{r.location}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-emerald-600">
                                                {rateForType ? `₹${rateForType}/kg` : 'Rate TBD'}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase">For {plasticType}</div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
              )}

              <button
                type="submit"
                disabled={isRequesting || recyclers.length === 0}
                className="w-full bg-slate-900 text-white rounded-xl py-4 flex items-center justify-center space-x-3 hover:bg-slate-800 transition active:scale-[0.98] disabled:opacity-50 font-bold text-lg mt-6"
              >
                {isRequesting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Requesting Pickup...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Request Pickup</span>
                  </>
                )}
              </button>
            </form>
>>>>>>> 96c684204a85d8db483cbbbe193125389cbff8ed
          </div>
        </div>

        {/* Logs Feed */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Your Logs</h3>
                <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs font-bold">{logs.length} Total</span>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto max-h-[600px] flex-1">
                {logs.length === 0 ? (
                     <p className="text-sm text-slate-400 text-center py-8">No collections logged yet.</p>
                ) : (
                    logs.map(log => (
                        <div key={log.id} className="p-4 border border-slate-200 rounded-xl space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-slate-800">{log.weight}kg <span className="text-slate-500 font-normal">{log.plasticType}</span></div>
                                    {log.recycler?.recyclerProfile && (
                                        <div className="text-xs text-slate-500 mt-1">To: {log.recycler.recyclerProfile.businessName}</div>
                                    )}
<<<<<<< HEAD
                                    {log.consumer && (
                                        <div className="text-xs text-slate-500 mt-1">From: Consumer {log.consumer.id.substring(0,8)}...</div>
                                    )}
=======
>>>>>>> 96c684204a85d8db483cbbbe193125389cbff8ed
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide
                                    ${log.status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-700' : 
                                      log.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' : 
                                      log.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 
                                      'bg-emerald-100 text-emerald-800'}`}>
                                    {log.status}
                                </span>
                            </div>
                            
                            {log.status === 'ACCEPTED' && (
                                <button 
                                    onClick={() => handleSubmitToLedger(log.id)}
                                    disabled={isSyncing && syncingLogId === log.id}
                                    className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition disabled:opacity-50 flex justify-center items-center space-x-2"
                                >
                                    {isSyncing && syncingLogId === log.id ? (
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Radio className="w-3 h-3" />
                                    )}
                                    <span>Sync to Ledger</span>
                                </button>
                            )}

                            {log.hcsSequenceNumber && (
                                <div className="pt-2 mt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                                    HCS Seq: {log.hcsSequenceNumber}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {result && (
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200 animate-in slide-in-from-bottom duration-500 shadow-lg shadow-green-500/5">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-500 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-green-900 leading-none">Sync Successful</h3>
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
<<<<<<< HEAD
=======

>>>>>>> 96c684204a85d8db483cbbbe193125389cbff8ed

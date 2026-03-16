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
  Dna
} from "lucide-react";

export default function RecyclerDashboard() {
  const [logs, setLogs] = useState([]);
  const [balance, setBalance] = useState(null); // null means 'Connecting...'
  const [tokenId, setTokenId] = useState("0.0.8229487");
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(null); // stores logId of log being minted

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch("/api/hedera/hts");
      const data = await resp.json();
      if (data.logs) {
        setLogs(data.logs);
        setBalance(data.tokenBalance?.toString() || "0");
        setTokenId(data.tokenId || "0.0.8229487");
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

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
        // Remove from list and refresh balance
        setLogs(prev => prev.filter(l => l.id !== logId));
        fetchLogs(); 
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Credit Minting Terminal</h1>
          <p className="text-slate-500 mt-1 uppercase tracking-wider text-xs font-semibold">Recycler Dashboard • Hedera Token Service HTS</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              setBalance(null);
              fetchLogs();
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Balance</span>
          </button>
          <button 
            onClick={fetchLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            <Clock className="w-4 h-4" />
            <span>Sync Queue</span>
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
                {balance === null ? (
                  <span className="text-slate-500 animate-pulse text-2xl">Connecting...</span>
                ) : (
                  <>
                    {balance} <span className="text-xs ml-2 text-slate-400">CREDITS</span>
                  </>
                )}
              </p>
              <div className="mt-6 flex items-center space-x-2 text-green-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>On-Chain Verified</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Coins className="w-20 h-20" />
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
        </div>

        {/* Main List Column */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Factory className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Pending Processing</h3>
                  <p className="text-xs text-slate-500 font-medium">Verified bags ready for credit generation</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {logs.length} BAGS IN QUEUE
              </span>
            </div>

            <div className="divide-y divide-slate-100 min-h-[400px]">
              {isLoading ? (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
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
                             <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded leading-none">VERIFIED</span>
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

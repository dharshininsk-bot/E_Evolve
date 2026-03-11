"use client";

import { useState, useEffect } from "react";
import { Activity, Hash, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ImpactLedger() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // Mock HCS Events representing the traceability ledger
    setEvents([
      { 
        id: "seq-1049", 
        timestamp: new Date().toISOString(), 
        type: "CREDIT_RETIRED",
        description: "Producer (EcoPack) retired 50 PRC",
        txId: "0.0.999@1678881200",
        color: "text-rose-400", bg: "bg-rose-500/10"
      },
      { 
        id: "seq-1048", 
        timestamp: new Date(Date.now() - 3600000).toISOString(), 
        type: "CREDIT_MINTED",
        description: "Recycler (GreenCity) minted 50 PRC from Batch B-2948",
        txId: "0.0.122@1678877600",
        color: "text-indigo-400", bg: "bg-indigo-500/10"
      },
      { 
        id: "seq-1047", 
        timestamp: new Date(Date.now() - 7200000).toISOString(), 
        type: "BATCH_VERIFIED",
        description: "Recycler (GreenCity) verified Batch B-2948 (50kg)",
        txId: "0.0.122@1678874000",
        color: "text-emerald-400", bg: "bg-emerald-500/10"
      },
      { 
        id: "seq-1046", 
        timestamp: new Date(Date.now() - 86400000).toISOString(), 
        type: "BATCH_COLLECTED",
        description: "Collector (City Transport) claimed 50kg PET",
        txId: "0.0.405@1678787600",
        color: "text-blue-400", bg: "bg-blue-500/10"
      },
      { 
        id: "seq-1045", 
        timestamp: new Date(Date.now() - 90000000).toISOString(), 
        type: "PLASTIC_DEPOSITED",
        description: "Consumer dropped off 50kg PET at Bin #44",
        txId: "0.0.331@1678784000",
        color: "text-amber-400", bg: "bg-amber-500/10"
      }
    ]);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-neutral-800 rounded-2xl mb-4">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-3">Public Impact Ledger</h1>
        <p className="text-neutral-400 max-w-xl mx-auto">
          Immutable traceability of plastic from collection to recycling, powered by the Hedera Consensus Service.
        </p>
      </header>

      {/* Timeline */}
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-800 before:to-transparent">
        {events.map((event, index) => (
          <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            {/* Timeline dot */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-neutral-950 absolute left-0 md:left-1/2 -translate-x-1/2 translate-y-2 z-10 ${event.bg}`}>
               <CheckCircle2 className={`w-5 h-5 ${event.color}`} />
            </div>
            
            {/* Content Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow shadow-black/50 hover:border-neutral-700 transition-colors">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${event.color}`}>
                    {event.type}
                  </span>
                  <time className="text-xs text-neutral-500 font-mono">
                    {new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </time>
                </div>
                
                <h3 className="text-neutral-200 font-medium my-1">
                  {event.description}
                </h3>
                
                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-neutral-800/50">
                  <Hash className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-xs text-neutral-400 font-mono truncate" title={event.txId}>
                    {event.txId}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-600 ml-auto" />
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

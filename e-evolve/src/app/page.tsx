"use client";

import Link from "next/link";
import { Recycle, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="p-4 bg-emerald-500/10 rounded-3xl mb-8">
        <Recycle className="h-16 w-16 text-emerald-400" />
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
        The Future of <br/>
        <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          Circular Economy
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-12">
        A decentralized platform connecting consumers, waste collectors, recyclers, and producers to trace and incentivize plastic recycling.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/signup" 
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          Join the Network
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link 
          href="/login" 
          className="px-8 py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-bold text-lg transition-all"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, Loader2, ArrowRight, ArrowLeft, Leaf, Truck, Recycle, Factory, MapPin } from "lucide-react";

const roles = [
  { id: "CONSUMER", title: "Consumer", desc: "Track your personal plastic impact and earn rewards.", icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "COLLECTOR", title: "Collector", desc: "Manage waste collections and synchronize with recyclers.", icon: Truck, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "RECYCLER", title: "Recycler", desc: "Verify incoming waste and mint plastic credits.", icon: Recycle, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "PRODUCER", title: "Producer", desc: "Purchase credits to offset your plastic footprint.", icon: Factory, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
];

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          role: selectedRole,
          businessName: selectedRole === 'RECYCLER' ? businessName : undefined,
          location: selectedRole === 'RECYCLER' ? location : undefined
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push(`/dashboard/${selectedRole.toLowerCase()}`);
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-2xl relative">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          
          <div className="flex items-center justify-between mb-10">
            <button 
              onClick={() => step === 1 ? router.push("/login") : setStep(1)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              <div className={`w-12 h-1.5 rounded-full transition-all ${step === 1 ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
              <div className={`w-12 h-1.5 rounded-full transition-all ${step === 2 ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
            </div>
            <div className="w-9" /> {/* Spacer */}
          </div>

          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">Join E-Evolve</h1>
                <p className="text-slate-400">Choose your role in the circular economy</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                        setSelectedRole(role.id);
                        setStep(2);
                    }}
                    className={`group relative text-left p-6 rounded-2xl border transition-all hover:shadow-xl ${role.bg} ${role.border} hover:border-blue-500/50 hover:bg-slate-800/50 active:scale-[0.98] animate-in zoom-in-95 duration-300`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm ${role.color} bg-slate-900/50 group-hover:scale-110 transition-transform`}>
                      <role.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{role.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{role.desc}</p>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-blue-500" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-md mx-auto">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-slate-400 italic">Signing up as a <span className="text-blue-400 font-bold not-italic capitalize">{selectedRole?.toLowerCase()}</span></p>
              </div>

              <form onSubmit={handleSignup} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm animate-shake">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Create Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                {selectedRole === 'RECYCLER' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Business Name</label>
                        <div className="relative group">
                            <Factory className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                            type="text"
                            required
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="e.g. EcoRecycle Solutions"
                            className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Operation Area (District)</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <select
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-medium appearance-none"
                            >
                                <option value="" disabled>Select your district</option>
                                <option value="Adyar">Adyar</option>
                                <option value="Guindy">Guindy</option>
                                <option value="Velachery">Velachery</option>
                                <option value="Tambaram">Tambaram</option>
                                <option value="Teynampet">Teynampet</option>
                            </select>
                        </div>
                        <p className="text-[10px] text-slate-500 ml-1 italic">* This is where collectors will find you</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-8"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Complete Setup <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <p className="text-center mt-8 text-slate-400 text-sm font-medium">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

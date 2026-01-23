import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { ShieldAlert, Lock, Mail, ChevronRight, X, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [checking, setChecking] = useState(() => {
    const token = localStorage.getItem("token");
    return !!(token && token !== "undefined" && token !== "null");
  });

  const closeError = useCallback(() => setError(""), []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null") {
      API.get("/auth/check")
        .then((res) => {
          if (res.data.authenticated) {
            const target = res.data.role === "admin" ? "/admin" : "/user";
            navigate(target, { replace: true });
          } else {
            setChecking(false);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setChecking(false);
        });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return setError("Protocol Error: Invalid Identification Format");
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      const { token, role, username } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username || "User");
      navigate(role === "admin" ? "/admin" : "/user", { replace: true });
      
    } catch (err) {
      setError(err.response?.data?.message || "Security Breach: Unauthorized Access");
    } finally {
      setLoading(false);
    }
  };

  if (checking) return (
    <div className="h-screen bg-[#02040a] flex items-center justify-center">
       <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Syncing_Protocol...</p>
       </div>
    </div>
  );

  return (
    // Changed to flex-col-reverse for mobile, flex-row for desktop
    <div className="min-h-screen w-full flex flex-col-reverse lg:flex-row bg-[#02040a] pt-22 font-sans relative overflow-x-hidden">
      
      {/* --- ERROR POPUP (FLOATING) --- */}
      {error && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
           <div className="bg-white rounded-3xl p-5 shadow-[0_30px_100px_rgba(225,29,72,0.3)] border border-rose-100 flex items-center gap-4 animate-in slide-in-from-top-10">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 shrink-0">
                 <ShieldAlert size={20} />
              </div>
              <div className="flex-1">
                 <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest leading-none mb-1">Authorization_Failed</p>
                 <p className="text-[11px] font-bold text-slate-500 uppercase leading-tight">{error}</p>
              </div>
              <button onClick={closeError} className="p-2 hover:bg-slate-50 rounded-lg text-slate-300">
                 <X size={16} />
              </button>
           </div>
        </div>
      )}

      {/* --- LEFT PANEL: MOTIVATIONAL BACKDROP --- */}
      <div className="w-full lg:w-1/2 relative flex flex-col justify-between p-8 pt-0 md:p-16 border-t lg:border-t-0 lg:border-r border-white/5 bg-[#02040a]">
        {/* Background Overlays */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent z-10" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-20 space-y-12">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500">Operator_Ready</span>
          </div>

          {/* Motivational Headline */}
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8]">
            OWN THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400 italic font-thin tracking-normal">
              MOMENTUM
            </span>
          </h2>

          <div className="space-y-6">
            <p className="text-slate-200 text-base md:text-lg font-bold uppercase tracking-tight leading-tight">
              The grid is live. <br /> 
              The leads are fresh. <br />
              The success is <span className="text-blue-500">synchronized.</span>
            </p>
            
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed max-w-xs opacity-70">
              Every call is a connection. <br />
              Step in and <span className="text-white">dominate the distribution.</span>
            </p>
          </div>

          {/* Target Indicator */}
          <div className="flex items-center gap-4 pt-4">
             <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray="113" strokeDashoffset="30" className="text-blue-600" />
                </svg>
                <span className="text-[8px] font-mono text-white">72%</span>
             </div>
             <p className="text-[9px] font-bold text-white uppercase tracking-widest leading-none">Peak Performance Active</p>
          </div>
        </div>

        {/* Technical Footer */}
        <div className="relative z-20 pt-4 space-y-4">
           <div className="flex gap-1.5">
             {[...Array(4)].map((_, i) => (
               <div key={i} className="h-0.5 w-8 bg-blue-600/20 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 animate-[loading_2s_infinite]" style={{ animationDelay: `${i * 0.4}s` }} />
               </div>
             ))}
           </div>
           <p className="text-slate-600 text-[8px] font-black uppercase tracking-[0.3em]">Proprietary_Authorization_Grid</p>
        </div>
      </div>

      {/* --- RIGHT PANEL: LOGIN TERMINAL --- */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 min-h-[500px] lg:min-h-screen bg-[#02040a]">
        
        {/* Logo Section */}
        <div className="mb-12">
           <header className="space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none">Initialize<br/>Session</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Credentials_Required</p>
          </header>
        </div>

        <div className="w-full max-w-sm space-y-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                  type="email" placeholder="IDENTIFICATION_MAIL" 
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full bg-[#0a0c14] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all placeholder:text-slate-700" 
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                  type="password" placeholder="SECURITY_KEY" 
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full bg-[#0a0c14] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all placeholder:text-slate-700" 
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="group w-full bg-white text-black py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all active:scale-95 disabled:opacity-20"
            >
              {loading ? "INITIALIZING..." : "Access System"}
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <footer className="pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">
            <span>Encryption: AES-256</span>
            <span>v2.4.0</span>
          </footer>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
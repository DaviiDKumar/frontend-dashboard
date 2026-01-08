import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import HeroImage from "/home.jpg"; 

// Visual elements
const CheckIcon = () => (
  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
  </svg>
);

export default function Home() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      // ✅ Only call backend if we have a valid-looking token
      if (token && token !== "undefined" && token !== "null") {
        try {
          const res = await API.get("/auth/check");
          setRole(res.data.role);
        } catch (err) {
          console.error("Auth Check Error:", err);
          console.warn("Home session check failed");
          localStorage.clear(); // Clear bad data
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-xs">Synchronizing</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900 font-sans selection:bg-blue-100 relative overflow-x-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
      
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="flex-1 space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">v2.0 Enterprise Ready</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
              Precision <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Lead</span> <br /> 
              Management.
            </h1>

            <p className="text-slate-500 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              The high-performance dashboard for <span className="text-slate-900 font-bold">DATATech</span> teams. 
              Sync, distribute, and track leads with sub-second latency.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {role ? (
                <button
                  onClick={() => navigate(role === "admin" ? "/admin" : "/user")}
                  className="w-full sm:w-auto bg-slate-900 text-white font-black px-10 py-5 rounded-2xl shadow-2xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 active:scale-95 transition-all duration-300 uppercase tracking-widest text-sm"
                >
                  Enter Dashboard
                </button>
              ) : (
                <Link
                  to="/login"
                  className="w-full sm:w-auto bg-blue-600 text-white font-black px-10 py-5 rounded-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all duration-300 uppercase tracking-widest text-sm"
                >
                  Sign In to Start
                </Link>
              )}
              
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100 max-w-md mx-auto lg:mx-0">
               <div className="flex items-center gap-3">
                 <div className="bg-green-50 p-1 rounded-md"><CheckIcon /></div>
                 <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Excel Sync</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="bg-green-50 p-1 rounded-md"><CheckIcon /></div>
                 <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Auto-Assign</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="bg-green-50 p-1 rounded-md"><CheckIcon /></div>
                 <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Real-time stats</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="bg-green-50 p-1 rounded-md"><CheckIcon /></div>
                 <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Secure Access</span>
               </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="flex-1 relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative bg-white border border-slate-100 p-4 rounded-[3rem] shadow-2xl">
              <img
                src={HeroImage}
                alt="DATATech Dashboard Preview"
                className="w-full max-w-2xl rounded-[2rem] object-cover shadow-inner"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 hidden md:block animate-bounce-slow">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Leads</p>
                <p className="text-3xl font-black text-slate-900">12,482+</p>
                <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-3/4 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-10 border-t border-slate-100 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
          &copy; 2026 DATATechServices. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
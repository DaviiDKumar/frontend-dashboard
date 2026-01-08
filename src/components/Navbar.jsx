import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

// Minimalist premium logout icon
const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// High-end abstract data icon
const BrandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <circle cx="12" cy="12" r="3" />
    <path d="M16 16l3.5 3.5" />
    <path d="M20 5l-3.5 3.5" />
    <path d="M5 20l3.5-3.5" />
    <path d="M8.5 8.5L5 5" />
  </svg>
);

export default function Navbar({ role }) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Agent";

  const handleLogout = async () => {
    try {
      // ✅ withCredentials is sent automatically by our API instance
      await API.post("/auth/logout");
    } catch (err) {
      console.error("Session termination failed:", err);
    } finally {
      // ✅ Completely wipe the client-side session
      localStorage.clear();
      // ✅ Force redirect to login page
      navigate("/", { replace: true });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand / Logo Section */}
        <Link to="/" className="group flex items-center gap-3 cursor-pointer">
          <div className="bg-slate-900 p-2 rounded-xl shadow-lg shadow-slate-200 group-hover:bg-blue-600 group-hover:shadow-blue-200 group-hover:-rotate-6 transition-all duration-500">
            <BrandIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">
              DATA<span className="text-blue-600">TECH</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mt-1">
              {role === "admin" ? "Systems Control" : "Workspace Hub"}
            </span>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated as</p>
            <p className="text-xs font-bold text-slate-900 leading-none">{username}</p>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

          <button
            onClick={handleLogout}
            className="group flex items-center bg-white border border-slate-200 text-slate-600 font-black px-5 py-2.5 rounded-xl transition-all duration-300 text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95 shadow-sm hover:shadow-red-100 cursor-pointer"
          >
            <LogOutIcon />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

// Minimal Lock Icon for branding
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ SESSION CHECK: Runs once when the page loads
  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");

    // If no token exists, just stop the loading screen
    if (!token) {
      setChecking(false);
      return;
    }

    // If token exists, verify it with the backend
    API.get("/auth/check")
      .then((res) => {
        if (!isMounted) return;
        const { role, username } = res.data;

        if (role) {
          // Sync local storage just in case
          localStorage.setItem("role", role);
          localStorage.setItem("username", username);
          // Redirect to the appropriate dashboard
          navigate(role === "admin" ? "/admin" : "/user", { replace: true });
        }
      })
      .catch(() => {
        if (!isMounted) return;
        // Token is invalid/expired, clear it so we don't loop
        localStorage.clear();
        setChecking(false);
      });

    return () => { isMounted = false; };
  }, [navigate]);

  // ✅ LOGIN HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });
      
      // Extract data from the JSON body (Bearer Token system)
      const { token, role, username } = res.data;

      // Store in LocalStorage - This is what Safari allows while it blocks cookies
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      // Navigate to dashboard
      navigate(role === "admin" ? "/admin" : "/user", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOADING STATE
  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfdfe]">
        <div className="w-10 h-10 border-2 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Establishing Secure Connection
        </p>
      </div>
    );
  }

  // ✅ LOGIN UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfe] px-6 relative overflow-hidden selection:bg-blue-100">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-slate-100 rounded-full blur-[100px] opacity-40"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-12 space-y-4">
          <div className="bg-slate-900 p-4 rounded-[1.25rem] shadow-2xl shadow-slate-200 group transition-all duration-500 hover:rotate-6">
            <LockIcon />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-blue-600">
              DATATECH
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">Portal Authentication</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 space-y-7"
        >
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-[11px] font-black p-4 rounded-2xl text-center uppercase tracking-wider animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">
              Work Email
            </label>
            <input
              type="email"
              required
              placeholder="e.g. name@datatech.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4.5 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4.5 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-[1.25rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Verifying Credentials..." : "Sign In to Workspace"}
          </button>
        </form>

        <footer className="mt-10 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Protected by End-to-End Encryption
          </p>
        </footer>
      </div>
    </div>
  );
}
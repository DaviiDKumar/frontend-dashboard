import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ 1. Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Check for common 'broken' storage strings
    if (!token || token === "undefined" || token === "null") {
      setChecking(false);
      return;
    }

    API.get("/auth/check")
      .then((res) => {
        const { role } = res.data;
        navigate(role === "admin" ? "/admin" : "/user", { replace: true });
      })
      .catch(() => {
        // If the token is invalid, clear storage so we don't try again
        localStorage.clear();
        setChecking(false);
      });
  }, [navigate]);

  // ✅ 2. Handle Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });
      
      const { token, role, username } = res.data;

      // ✅ Validation to ensure we don't save empty strings
      if (token && role) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username || "User");
        
        navigate(role === "admin" ? "/admin" : "/user", { replace: true });
      } else {
        setError("Session data incomplete. Try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Verifying Session</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2rem] shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight">Data<span className="text-blue-600">Tech</span></h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Authorized Access Only</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-xs font-bold border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input 
            type="email" 
            autoComplete="username"
            placeholder="Work Email" 
            className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            autoComplete="current-password"
            placeholder="Password" 
            className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-blue-600 shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In to System"}
          </button>
        </div>
      </form>
    </div>
  );
}
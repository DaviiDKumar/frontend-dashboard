import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ FIX: Determine initial state synchronously to avoid ESLint render error
  const [checking, setChecking] = useState(() => {
    const token = localStorage.getItem("token");
    return !!(token && token !== "undefined" && token !== "null");
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Only verify if a token actually exists
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
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", { 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      const { token, role, username } = res.data;

      if (token && role) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username || "User");
        
        navigate(role === "admin" ? "/admin" : "/user", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-white font-black text-[10px] tracking-[0.5em] text-slate-300 uppercase">
      Establishing Secure Protocol...
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-100">
        <h2 className="text-4xl font-black mb-8 text-center tracking-tighter uppercase leading-none italic">
          Matrix<span className="text-blue-600 not-italic">.</span>Grid
        </h2>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-[10px] font-black uppercase text-center animate-pulse">{error}</div>}
        
        <div className="space-y-4">
          <input 
            type="email" placeholder="EMAIL" 
            className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-blue-500 font-bold text-sm"
            value={email} onChange={(e) => setEmail(e.target.value)} required 
          />
          <input 
            type="password" placeholder="PASSWORD" 
            className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-blue-500 font-bold text-sm"
            value={password} onChange={(e) => setPassword(e.target.value)} required 
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "AUTHORIZING..." : "INITIATE SESSION"}
          </button>
        </div>
      </form>
    </div>
  );
}
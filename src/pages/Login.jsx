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
    if (!token || token === "undefined") {
      setChecking(false);
      return;
    }

    API.get("/auth/check")
      .then((res) => {
        const { role } = res.data;
        navigate(role === "admin" ? "/admin" : "/user", { replace: true });
      })
      .catch(() => {
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
      
      // ✅ Explicitly map keys to avoid 'undefined'
      const token = res.data.token;
      const role = res.data.role;
      const username = res.data.username;

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

  if (checking) return <div className="flex justify-center items-center min-h-screen">Verifying Session...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">DataTech Login</h2>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Work Email" 
            className="w-full p-4 bg-slate-50 rounded-xl border-none outline-blue-500"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 bg-slate-50 rounded-xl border-none outline-blue-500"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-all"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
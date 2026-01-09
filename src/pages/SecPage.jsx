import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

// --- Icons ---
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;

export default function SecPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [inputs, setInputs] = useState({});
  
  // Success Modal State
  const [successData, setSuccessData] = useState({ open: false, username: "" });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await API.get("/users/with-leads");
      setUsers(res.data.users || []);
    } catch (_err) { 
      console.error("Sync Error"); 
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const executeReset = async (userId, username) => {
    const password = inputs[userId];
    if (!password || password.length < 6) return alert("Min 6 chars required");

    setLoadingId(userId);
    try {
      await API.post("/users/reset-password", { userId, newPassword: password });
      
      // Open Success Popup instead of alert
      setSuccessData({ open: true, username });
      
      setInputs(prev => ({ ...prev, [userId]: "" })); 
    } catch (err) {
      alert(err.response?.data?.message || "Protocol Failure");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans text-slate-900">
      <Navbar role="admin" />
      
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <header className="flex items-center gap-6 mb-16">
          <button onClick={() => navigate("/admin")} className="p-4 bg-white border border-slate-200 rounded-3xl shadow-sm hover:bg-slate-50 transition-all active:scale-95">
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Security <span className="text-blue-600">Vault</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Credentials Management</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {users.map(u => (
            <div key={u._id} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg uppercase">{u.username.charAt(0)}</div>
                <div>
                  <p className="text-sm font-black uppercase text-slate-900">{u.username}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <input 
                  type="password" 
                  placeholder="NEW PASSKEY"
                  value={inputs[u._id] || ""}
                  onChange={(e) => setInputs({...inputs, [u._id]: e.target.value})}
                  className="bg-slate-50 border-none rounded-xl px-5 py-3 text-[10px] font-black tracking-[0.2em] outline-none focus:ring-2 focus:ring-blue-100 w-full md:w-48 transition-all"
                />
                <button 
                  onClick={() => executeReset(u._id, u.username)}
                  disabled={loadingId === u._id}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95"
                >
                  {loadingId === u._id ? "SYNC..." : <><ShieldIcon /> Update</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- INDUSTRIAL SUCCESS POPUP --- */}
      {successData.open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-12 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-6">
              <div className="bg-emerald-50 p-4 rounded-full">
                <CheckIcon />
              </div>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Access Rotated</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 leading-relaxed">
              New encryption keys generated for agent: <br/> 
              <span className="text-slate-900 font-black">@{successData.username}</span>
            </p>
            <button 
              onClick={() => setSuccessData({ open: false, username: "" })}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-xl"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
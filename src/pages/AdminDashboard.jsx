import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { X, AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react";

// --- Icons (Enhanced with standard Lucide-style strokes) ---
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3L15.5 7.5z"/></svg>;
const MoveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H9a4 4 0 1 0 0 8h1"/><path d="m8 21-4-4 4-4"/><path d="M4 17h11a4 4 0 1 0 0-8h-1"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const CloudIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 drop-shadow-lg"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>;
const ArchiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/><path d="M4 10h16"/><path d="M2 4h20v6H2z"/><path d="M10 14h4"/></svg>;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  const [modal, setModal] = useState({ show: false, userId: null, username: "" });

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showToast = useCallback((msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await API.get("/users/with-leads");
      setUsers(res.data.users || []);
    } catch (_e) { showToast("System Sync Error", "error"); }
  }, [showToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      await API.post("/files/upload", formData);
      setFile(null); fetchUsers();
      showToast("Data Grid Updated", "success");
    } catch (_e) { showToast("Deployment Failed", "error"); } 
    finally { setLoading(false); }
  };

  const createUser = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!username || !email || !password) return showToast("Required Fields Missing", "error");
    if (!emailRegex.test(email)) return showToast("Invalid Architecture", "error");
    setLoading(true);
    try {
      await API.post("/users", { username, email, password });
      setUsername(""); setEmail(""); setPassword("");
      fetchUsers();
      showToast("Node provisioned", "success");
    } catch (_e) { showToast("Provisioning Error", "error"); } 
    finally { setLoading(false); }
  };

  const confirmDelete = (user) => setModal({ show: true, userId: user._id, username: user.username });

  const executeDelete = async () => {
    const id = modal.userId;
    setModal({ show: false, userId: null, username: "" });
    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
      showToast("Node Deactivated", "success");
    } catch (_e) { showToast("Revocation Error", "error"); }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-24 font-sans text-slate-900 relative">
      <Navbar role="admin" />
      
      {/* --- MODAL (Tech Glass) --- */}
      {modal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setModal({ show: false, userId: null, username: "" })}></div>
            <div className="relative bg-white/90 backdrop-blur-xl w-full max-w-sm rounded-[3rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-white/20 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-[1.5rem] mb-6 flex items-center justify-center bg-rose-50 text-rose-500 shadow-inner">
                    <AlertTriangle size={32}/>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 leading-none">Revoke Access?</h2>
                <p className="text-slate-500 text-[10px] font-bold leading-relaxed mb-8 uppercase tracking-[0.2em]">
                    Targeting node <span className="text-rose-600 font-black">{modal.username}</span> for permanent removal from the grid.
                </p>
                <div className="flex gap-3">
                    <button onClick={() => setModal({ show: false, userId: null, username: "" })} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all">Abort</button>
                    <button onClick={executeDelete} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 hover:bg-rose-600 transition-all shadow-lg active:scale-95">Execute</button>
                </div>
            </div>
        </div>
      )}

      {/* --- TOAST (Minimalist Floating) --- */}
      {toast.show && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[210] px-8 py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border flex items-center gap-4 bg-white border-slate-100 animate-in slide-in-from-top-10">
          <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-800">{toast.msg}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pt-24 space-y-16">
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-4">
            <h1 className="text-7xl font-black tracking-tighter text-slate-900 leading-none">
                Admin
            </h1>
            <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-blue-600"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600">Administrative Operations</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => navigate("/admin/archives")}
              className="group flex items-center gap-6 bg-white border border-slate-100 p-6 rounded-[2.5rem] hover:border-blue-200 transition-all shadow-sm active:scale-95"
            >
                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-blue-600 group-hover:rotate-6 transition-all duration-300">
                  <ArchiveIcon />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Archived_Log</p>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Master Archives</p>
                </div>
            </button>

            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm text-center min-w-[180px]">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Total_Nodes_Active</p>
                <p className="text-5xl font-black text-slate-900 leading-none tracking-tighter">
                    {users.reduce((acc, u) => acc + (u.leadCount || 0), 0)}
                </p>
            </div>
          </div>
        </header>

        {/* MAIN CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* DEPLOY DATA CARD */}
          <section className="bg-white p-12 rounded-[3.5rem] border border-slate-50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col justify-between group">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-2xl font-black uppercase tracking-tighter italic">Deploy Data</h2>
               <button onClick={() => navigate("/admin/reassign")} className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                  <MoveIcon /> Reassign
               </button>
            </div>
            <div className="group/file relative border-2 border-dashed border-slate-100 rounded-[2.5rem] p-16 text-center hover:bg-blue-50/30 hover:border-blue-200 transition-all cursor-pointer">
                <div className="flex justify-center mb-6 group-hover/file:-translate-y-2 transition-transform duration-500">
                    <CloudIcon />
                </div>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {file ? <span className="text-blue-600">{file.name}</span> : "Drop Distribution File"}
                </p>
            </div>
            <button onClick={handleUpload} disabled={loading || !file} className="mt-10 w-full bg-slate-900 text-white py-6 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-xl hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-20">
              {loading ? "Synchronizing..." : "Execute Deployment"}
            </button>
          </section>

          {/* PROVISION IDENTITY CARD */}
          <section className="bg-white p-12 rounded-[3.5rem] border border-slate-50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-10">Add Caller</h2>
            <div className="space-y-5 flex-1">
                <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-300 uppercase ml-4 tracking-[0.2em]">Agent_Name</label>
                    <input type="text" placeholder="ALPHANUMERIC" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-5 bg-slate-50 border-none rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-300 uppercase ml-4 tracking-[0.2em]">Email_Address</label>
                    <input type="email" placeholder="SECURE_MAIL" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-5 bg-slate-50 border-none rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-300 uppercase ml-4 tracking-[0.2em]">Security_Key</label>
                    <input type="password" placeholder="MIN_6_CHARS" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-5 bg-slate-50 border-none rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                </div>
            </div>
            <button onClick={createUser} disabled={loading} className="mt-10 w-full bg-slate-900 text-white py-6 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-xl hover:bg-blue-600 active:scale-[0.98] transition-all">
              {loading ? "Authorizing..." : "Initialize Agent Node"}
            </button>
          </section>
        </div>

        {/* AGENT HIERARCHY GRID */}
        <div className="space-y-10">
          <div className="flex justify-between items-center px-6">
             <div className="flex items-center gap-4">
                <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-400">Agent Hierarchy</h2>
                <div className="h-px w-20 bg-slate-200"></div>
             </div>
             <button onClick={() => navigate("/admin/security")} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-lg transition-all">Manage Security Vault</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {users.map((u) => (
              <div key={u._id} className="bg-white border border-slate-100 rounded-[2.5rem] p-6 hover:border-blue-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-500 group flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                      <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                          <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Rank: Agent</p>
                      </div>
                      <div className="text-right leading-none">
                        <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">Leads</p>
                         <p className="text-2xl font-black text-slate-900 tracking-tighter">{u.leadCount || 0}</p>
                      </div>
                   </div>
                   <h4 className="text-[13px] font-black text-slate-900 uppercase truncate leading-none mb-1.5">{u.username}</h4>
                   <p className="text-[9px] font-bold text-slate-400 truncate mb-6">{u.email}</p>
                </div>
                {u.role !== 'admin' && (
                  <div className="flex items-center gap-2 pt-5 border-t border-slate-50 relative z-10">
                    <button onClick={() => navigate("/admin/security")} className="flex-1 flex justify-center py-3 bg-slate-50 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all duration-300"><KeyIcon /></button>
                    <button onClick={() => navigate("/admin/reassign")} className="flex-1 flex justify-center py-3 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-300"><MoveIcon /></button>
                    <button onClick={() => confirmDelete(u)} className="flex-1 flex justify-center py-3 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300"><TrashIcon /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
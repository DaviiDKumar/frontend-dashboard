import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

// --- Icons ---
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3L15.5 7.5z"/></svg>;
const MoveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H9a4 4 0 1 0 0 8h1"/><path d="m8 21-4-4 4-4"/><path d="M4 17h11a4 4 0 1 0 0-8h-1"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const CloudIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

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
    } catch (_e) {
      console.error("System Sync Error:", _e);
      showToast("System Sync Error", "error");
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      await API.post("/files/upload", formData);
      setFile(null);
      fetchUsers();
      showToast("Database Distributed", "success");
    } catch (_e) {
      console.error("Deployment Error:", _e);
      showToast("Deployment Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    if (!username || !email || !password) return showToast("Required Fields Missing", "error");
    setLoading(true);
    try {
      await API.post("/users", { username, email, password });
      setUsername(""); setEmail(""); setPassword("");
      fetchUsers();
      showToast("Node Identity Provisioned", "success");
    } catch (_e) {
      console.error("Provisioning Error:", _e);
      showToast("Provisioning Error", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Revoke Access Permanently?")) return;
    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
      showToast("Agent Access Revoked", "success");
    } catch (_e) {
      console.error("Revocation Error:", _e);
      showToast("Revocation Error", "error");
    }
  };

  return (
    <div className="bg-[#fcfdfe] min-h-screen pb-24 font-sans text-slate-900">
      <Navbar role="admin" />
      
      {toast.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-100 px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 bg-white border-slate-100 animate-in slide-in-from-top-10">
          <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <p className="text-[11px] font-black uppercase tracking-widest">{toast.msg}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter text-slate-900">System<span className="text-blue-600">.</span>Grid</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Administrative Terminal</p>
          </div>
          <div className="bg-white border border-slate-100 p-6 rounded-4xl shadow-2xl text-center min-w-40">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Leads</p>
             <p className="text-4xl font-black text-slate-900 leading-none">{users.reduce((acc, u) => acc + (u.leadCount || 0), 0)}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white p-10 rounded-4xl border border-slate-50 shadow-xl shadow-slate-200/50">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-xl font-black uppercase tracking-tight">Deploy Data</h2>
               <button onClick={() => navigate("/admin/reassign")} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-100 transition-all">
                  <MoveIcon /> Reassign Page
               </button>
            </div>
            <div className="group relative border-2 border-dashed border-slate-100 rounded-4xl p-12 text-center hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer">
                <div className="flex justify-center mb-4"><CloudIcon /></div>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {file ? <span className="text-blue-600 font-black">{file.name}</span> : "Select Distribution File"}
                </p>
            </div>
            <button onClick={handleUpload} disabled={loading || !file} className="mt-8 w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg active:scale-95 transition-all">
              Execute Deployment
            </button>
          </section>

          <section className="bg-white p-10 rounded-4xl border border-slate-50 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight mb-8">Provision Identity</h2>
            <div className="space-y-4">
                <input type="text" placeholder="NAME" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black tracking-widest outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                <input type="email" placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black tracking-widest outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black tracking-widest outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
            </div>
            <button onClick={createUser} disabled={loading} className="mt-8 w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg active:scale-95 transition-all">
              Initialize Agent
            </button>
          </section>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Agent Hierarchy</h2>
             <button onClick={() => navigate("/admin/security")} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Manage Security Vault</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {users.map((u) => (
              <div key={u._id} className="bg-gray-100 border border-slate-100 rounded-4xl p-5 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-1.5 h-full `}></div>
                <div>
                   <div className="flex justify-between items-start mb-4">
                     
                      <div className="text-right leading-none">
                        <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest mt-1">Leads</p>
                         <p className="text-xl font-black text-slate-900">{u.leadCount || 0}</p>
                         
                      </div>
                   </div>
                   <h4 className="text-sm font-black text-slate-900 uppercase truncate leading-none mb-1">{u.username}</h4>
                   <p className="text-[9px] font-bold text-slate-700 truncate mb-4">{u.email}</p>
                </div>
                {u.role !== 'admin' && (
                  <div className="flex items-center gap-1.5 pt-4 border-t border-slate-50">
                    <button onClick={() => navigate("/admin/security")} className="flex-1 flex justify-center py-2 bg-slate-50 rounded-lg text-slate-900 hover:text-amber-600 transition-all"><KeyIcon /></button>
                    <button onClick={() => navigate("/admin/reassign")} className="flex-1 flex justify-center py-2 bg-slate-50 rounded-lg text-slate-900 hover:text-blue-600 transition-all"><MoveIcon /></button>
                    <button onClick={() => deleteUser(u._id)} className="flex-1 flex justify-center py-2 bg-slate-50 rounded-lg text-slate-800 hover:text-red-600 transition-all"><TrashIcon /></button>
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
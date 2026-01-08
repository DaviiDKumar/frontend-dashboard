import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

// Icons (Premium minimalist designs)
const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function AdminDashboard() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Safe Session Retrieval
  const adminDisplayName = (() => {
    const saved = localStorage.getItem("username");
    return saved && saved !== "undefined" ? saved : "Administrator";
  })();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/with-leads");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Matrix Sync Error:", err);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a lead database (Excel/CSV)");
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const res = await API.post("/files/upload", formData);
      setMessage(res.data.message || "Distribution Complete");
      setFile(null);
      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || "File processing failed");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    if (!username || !email || !password) return alert("All identity fields required");
    try {
      setLoading(true);
      await API.post("/users", { 
        username: username.trim().toLowerCase(), 
        email: email.trim(), 
        password 
      });
      setUsername(""); setEmail(""); setPassword("");
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "User creation failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("⚠️ Revoke Access? This agent will be disconnected immediately.")) return;
    try {
      setLoading(true);
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Revocation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 font-sans pb-20">
      <Navbar role="admin" />

      <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-10">
          <div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900 uppercase">
              Admin <span className="text-blue-600">Portal</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Secure Session Active • {adminDisplayName}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
             <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm text-center min-w-35">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Active Agents</p>
                <p className="text-2xl font-black">{users.filter(u => u.role === 'user').length}</p>
             </div>
             <div className="bg-blue-600 px-6 py-4 rounded-3xl shadow-lg shadow-blue-200 text-center min-w-35">
                <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest leading-none mb-1">System Leads</p>
                <p className="text-2xl font-black text-white">{users.reduce((acc, u) => acc + (u.leadCount || 0), 0)}</p>
             </div>
          </div>
        </header>

        {/* Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Lead Distribution Card */}
          <section className="bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black uppercase">Lead Distribution</h3>
                <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Auto-Distribute</span>
            </div>

            <div className="group relative border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center min-h-50">
                <FolderIcon />
                <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <p className="text-sm font-bold text-slate-500 max-w-50 leading-relaxed">
                    {file ? <span className="text-blue-600 font-black">{file.name}</span> : "Select lead database to deploy to agents"}
                </p>
            </div>

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="mt-6 w-full flex justify-center items-center bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-100 active:scale-95 transition-all disabled:opacity-50"
            >
              <UploadIcon />
              {loading ? "Deploying Data..." : "Deploy Leads Now"}
            </button>

            {/* ✅ FIXED: ESLint error resolved by using 'message' here */}
            {message && (
              <div className={`mt-4 p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider animate-in fade-in duration-500 ${
                message.includes("failed") || message.includes("Error") 
                ? "bg-red-50 border-red-100 text-red-600" 
                : "bg-green-50 border-green-100 text-green-700"
              }`}>
                {message}
              </div>
            )}
          </section>

          {/* User Provisioning Card */}
          <section className="bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black uppercase">Provision Agent</h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full uppercase tracking-tighter">New Identity</span>
            </div>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-4 border border-slate-100 bg-slate-50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm font-medium"
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 border border-slate-100 bg-slate-50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm font-medium"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 border border-slate-100 bg-slate-50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm font-medium"
                />
            </div>

            <button
              onClick={createUser}
              disabled={loading}
              className="mt-8 w-full flex justify-center items-center bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 transition-all"
            >
              <UserPlusIcon />
              {loading ? "Authorizing..." : "Create Identity"}
            </button>
          </section>
        </div>

        {/* Directory Matrix */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-black uppercase tracking-[0.3em] text-xs text-slate-400">
              Agent Matrix ({users.length})
            </h2>
            <button 
                onClick={fetchUsers} 
                className="text-[10px] font-black uppercase text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all border border-blue-100"
            >
                Refresh Matrix
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((u) => (
              <div key={u._id} className="group bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-2 h-full ${u.role === 'admin' ? 'bg-purple-500' : 'bg-blue-600'}`}></div>
                
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 uppercase">
                        {u.username?.charAt(0) || u.email?.charAt(0)}
                    </div>
                    <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                        {u.role}
                    </span>
                </div>

                <h4 className="font-black text-lg truncate text-slate-800">
                  {u.username && u.username !== "undefined" ? u.username : u.email.split('@')[0]}
                </h4>
                <p className="text-xs text-slate-400 truncate mb-4 font-medium">{u.email}</p>

                <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center mb-4 border border-slate-100/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Load Balance</p>
                    <p className="font-black text-slate-900 leading-none">{u.leadCount || 0}</p>
                </div>

                {u.role !== "admin" && (
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="w-full flex items-center justify-center text-[10px] uppercase font-black text-red-400 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon />
                    Revoke Access
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
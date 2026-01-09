import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

// --- Vectors ---
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const TransferIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 10l4 4-4 4m-10-8l-4 4 4 4"/><path d="M21 14H3"/></svg>;
const CheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;

export default function ReassignPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataReady, setDataReady] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [sourceUser, setSourceUser] = useState(null);
  const [targetUser, setTargetUser] = useState(null);

  const fetchInitialData = useCallback(async () => {
    try {
      const [filesRes, usersRes] = await Promise.all([
        API.get("/files/admin/all"), 
        API.get("/users/with-leads")
      ]);
      setFiles(filesRes.data || []);
      setUsers(usersRes.data.users || []);
      setDataReady(true);
    } catch (err) {
      console.error("Sync Error", err);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const executeTransfer = async () => {
    if (!selectedFile || !sourceUser || !targetUser) return;
    setLoading(true);
    try {
      await API.post("/reassign", {
        fileId: selectedFile._id,
        oldUserId: sourceUser._id,
        newUserId: targetUser._id
      });
      navigate("/admin");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Transfer failed"));
    } finally {
      setLoading(false);
    }
  };

  if (!dataReady) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Loading Protocol</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32 font-sans text-slate-900">
      <Navbar role="admin" />
      
      <div className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* --- DYNAMIC STEPPER HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/admin")} className="group p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-500 transition-all active:scale-95">
              <ArrowLeft />
            </button>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none italic">Reroute<span className="text-blue-600 not-italic">.</span>Data</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Administrative Lead Transfer</p>
            </div>
          </div>

          {/* Stepper Status */}
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            {[
              { label: "Batch", active: !!selectedFile },
              { label: "Source", active: !!sourceUser },
              { label: "Target", active: !!targetUser }
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${step.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                  {step.active ? <CheckCircle /> : i + 1}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${step.active ? 'text-slate-900' : 'text-slate-300'}`}>{step.label}</span>
                {i < 2 && <div className="w-4 h-[2px] bg-slate-100 ml-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* --- MAIN MATRIX --- */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* STEP 1: BATCH SELECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">01. Database Batch</h2>
              {selectedFile && <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase">Locked</span>}
            </div>
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
              {files.map(f => (
                <div 
                  key={f._id} 
                  onClick={() => { setSelectedFile(f); setSourceUser(null); setTargetUser(null); }} 
                  className={`relative p-6 rounded-3xl border-2 transition-all duration-300 group cursor-pointer ${selectedFile?._id === f._id ? 'border-blue-600 bg-white shadow-xl shadow-blue-100/50' : 'border-white bg-white hover:border-slate-200 shadow-sm'}`}
                >
                  <p className="text-sm font-black uppercase text-slate-900 truncate pr-6">{f.fileName}</p>
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-2">Current Ownership</p>
                    <div className="flex flex-wrap gap-1.5">
                      {users.filter(u => f.assignedTo.includes(u._id)).map(u => (
                        <span key={u._id} className="px-2 py-1 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100">
                          {u.username}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: SOURCE OWNER */}
          <div className={`space-y-4 transition-all duration-500 ${!selectedFile ? 'opacity-20 grayscale pointer-events-none scale-95' : 'opacity-100'}`}>
            <div className="flex items-center justify-between px-4">
              <h2 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">02. Pick Source Agent</h2>
            </div>
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
              {users.filter(u => selectedFile?.assignedTo.includes(u._id)).map(u => (
                <div 
                  key={u._id} 
                  onClick={() => { setSourceUser(u); setTargetUser(null); }} 
                  className={`p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${sourceUser?._id === u._id ? 'border-blue-600 bg-white shadow-xl shadow-blue-100/50' : 'border-white bg-white hover:border-slate-200 shadow-sm'}`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-black uppercase text-slate-900">{u.username}</p>
                    <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Active Volume: {u.leadCount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3: TARGET RECEIVER */}
          <div className={`space-y-4 transition-all duration-500 ${!sourceUser ? 'opacity-20 grayscale pointer-events-none scale-95' : 'opacity-100'}`}>
            <div className="flex items-center justify-between px-4">
              <h2 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">03. Target Recipient</h2>
            </div>
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
              {users.filter(u => u.role !== 'admin' && u._id !== sourceUser?._id).map(u => (
                <div 
                  key={u._id} 
                  onClick={() => setTargetUser(u)} 
                  className={`p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${targetUser?._id === u._id ? 'border-emerald-500 bg-white shadow-xl shadow-emerald-100/50' : 'border-white bg-white hover:border-slate-200 shadow-sm'}`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-black uppercase text-slate-900">{u.username}</p>
                    {targetUser?._id === u._id && <div className="text-emerald-500"><CheckCircle /></div>}
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Available Capacity: {u.leadCount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- BOTTOM EXECUTION PANEL --- */}
        {targetUser && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                
                <div className="flex items-center gap-12">
                  <div className="text-center md:text-left">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Source Origin</p>
                    <p className="text-xl font-black text-white uppercase tracking-tighter leading-none">{sourceUser?.username}</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
                    <div className="relative p-4 bg-white/5 rounded-2xl text-blue-400 border border-white/10">
                      <TransferIcon />
                    </div>
                  </div>

                  <div className="text-center md:text-left">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">New Assignee</p>
                    <p className="text-xl font-black text-white uppercase tracking-tighter leading-none">{targetUser?.username}</p>
                  </div>
                </div>

                <button 
                  onClick={executeTransfer} 
                  disabled={loading}
                  className="w-full md:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "REROUTING DATA..." : "CONFIRM TRANSFER"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
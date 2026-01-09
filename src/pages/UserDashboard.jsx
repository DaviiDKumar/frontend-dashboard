import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

// --- Minimalist Executive Icons ---
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="15" y1="15" y2="3"/></svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

const StackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
);

export default function UserDashboard() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { 
    fetchFiles(); 
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await API.get("/files");
      setFiles(res.data.files || []);
    } catch (err) {
      console.error("Data Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (id, fileName) => {
    try {
      const res = await API.get(`/files/download/${id}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
    } catch (err) {
      console.error("Download Error:", err);
      alert("Download failed.");
    }
  };

  const totalUserLeads = files.reduce((acc, curr) => acc + (curr.totalLeads || 0), 0);

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 pb-24 font-sans selection:bg-indigo-100">
      <Navbar role="user" />

      <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-16">
        
        {/* --- LUXE HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-slate-200 pb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
               </span>
               <p className="text-indigo-600 font-bold uppercase text-[10px] tracking-[0.15em]">System Synchronized</p>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              Caller <span className="text-indigo-600">Terminal</span>
            </h1>
            <p className="text-sm font-medium text-slate-400 max-w-md">Manage your assigned data batches and lead inventory in real-time.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Global Lead Balance</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">
                {totalUserLeads.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-[1px] bg-slate-200 hidden md:block"></div>
            <div className="hidden md:block">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Batches</p>
               <p className="text-4xl font-black text-indigo-600 tracking-tighter">{files.length}</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="w-10 h-10 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">Accessing Encrypted Nodes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {files.map((file) => (
              <div 
                key={file._id} 
                className="group bg-white rounded-[2rem] border border-slate-200 p-8 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 relative flex flex-col justify-between overflow-hidden"
              >
                {/* Accent Flare */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700 opacity-50"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                    <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200 group-hover:bg-indigo-600 group-hover:shadow-indigo-200 transition-all duration-500">
                      <StackIcon />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Batch Vol.</p>
                      <p className="text-2xl font-black text-slate-900">{file.totalLeads}</p>
                    </div>
                  </div>

                  <h2 className="font-black text-xl text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                    {file.fileName.split('.')[0]}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    Released: {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-3 relative z-10">
                  <button
                    onClick={() => navigate(`/user/leads/${file._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all duration-300 active:scale-95 shadow-lg shadow-slate-100"
                  >
                    <EyeIcon /> View Data
                  </button>
                  
                  <button
                    onClick={() => downloadFile(file._id, file.fileName)}
                    className="w-14 flex items-center justify-center bg-white text-slate-400 border border-slate-200 rounded-2xl hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all active:scale-90"
                    title="Export to Excel"
                  >
                    <DownloadIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- SYSTEM FOOTER --- */}
        {!loading && files.length > 0 && (
          <footer className="pt-20 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
              Lead Dashboard • Secure User Environment v2.4
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
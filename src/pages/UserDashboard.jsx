import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);

export default function UserDashboard() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchFiles(); }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await API.get("/files");
      // The backend now returns { files: [...] }
      const data = res.data.files || [];
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFiles(sorted);
    } catch (err) {
      console.error("Data Fetch Error:", err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
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
            alert("Download failed");
    }
  };

  const totalUserLeads = files.reduce((acc, curr) => acc + (curr.totalLeads || 0), 0);

  return (
    <div className="bg-[#fcfdfe] min-h-screen text-slate-900 font-sans pb-20 selection:bg-blue-50">
      <Navbar role="user" />

      <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 pb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
               <p className="text-blue-600 font-black tracking-[0.2em] uppercase text-[10px]">Lead Inventory</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Your Assignments</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-7 py-5 rounded-[1.5rem] border border-slate-100 shadow-sm">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Total Leads</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-black text-slate-900">{totalUserLeads.toLocaleString()}</p>
                <span className="text-[10px] font-bold text-blue-600 uppercase">Records</span>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-[3px] border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Database...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-24 text-center">
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No Leads Assigned</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {files.map((file) => (
              <div key={file._id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] transition-all duration-500 group flex flex-col justify-between overflow-hidden relative">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100">
                      <FileIcon />
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Batch Size</p>
                      <p className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {file.totalLeads} <span className="text-[11px] text-slate-400 font-bold tracking-tight">Leads</span>
                      </p>
                    </div>
                  </div>

                  <h2 className="font-black text-xl text-slate-800 break-all leading-tight mb-6">{file.fileName}</h2>
                  
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-tighter shadow-sm">
                    <div className="flex flex-col text-xs font-bold text-slate-600 italic">
                        <span>{formatDate(file.createdAt)}</span>
                        <span>{formatTime(file.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => downloadFile(file._id, file.fileName)}
                  className="w-full mt-8 flex items-center justify-center bg-slate-900 text-white py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer hover:bg-slate-800 shadow-xl shadow-slate-100 active:scale-[0.98] relative z-10"
                >
                  <DownloadIcon /> Export Lead Set
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
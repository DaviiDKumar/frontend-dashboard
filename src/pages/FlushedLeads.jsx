import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { 
    ArrowLeft, Loader2, Archive, User as UserIcon, 
    Calendar, FileText, Download, Trash2, Search, 
    X, CheckCircle, Info, AlertTriangle 
} from "lucide-react";

export default function FlushedLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    // --- UI STATES ---
    const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
    const [modal, setModal] = useState({ show: false, title: "", desc: "", action: null, type: "info" });

    const navigate = useNavigate();

    const showPopup = useCallback((msg, type = "success") => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 4000);
    }, []);

    useEffect(() => { fetchAllArchives(); }, []);

    const fetchAllArchives = async () => {
        try {
            setLoading(true);
            const res = await API.get("/archive/admin/all-forwarded");
            const rawData = Array.isArray(res.data) ? res.data : [];
            
            const formatted = rawData.map(l => ({
                ...l,
                display_name: l.data?.["full name"] || l.data?.full_name || l.data?.Full_Name || "N/A",
                display_phone: String(l.data?.["phone number"] || l.data?.phone_number || l.data?.Phone || "N/A").replace('p:', '').trim(),
            }));
            
            setLeads(formatted);
        } catch (err) { showPopup("Sync failure", "error"); } 
        finally { setLoading(false); }
    };

    // --- EXECUTION LOGIC ---
    const executeDownload = async () => {
        setModal({ ...modal, show: false });
        try {
            setExporting(true);
            const res = await API.get("/archive/admin/download-all", { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `MASTER_EXPORT_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            showPopup("Master Export Successful");
        } catch (err) { showPopup("Export Failed", "error"); } 
        finally { setExporting(false); }
    };

    const executePurge = async () => {
        setModal({ ...modal, show: false });
        try {
            await API.delete("/archive/admin/purge-all");
            setLeads([]);
            showPopup("Archive Purged Successfully");
        } catch (err) { showPopup("Purge failed", "error"); }
    };

    const filteredLeads = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return leads.filter(l => 
            l.display_name.toLowerCase().includes(term) || 
            (l.fromUser?.username || "").toLowerCase().includes(term)
        );
    }, [leads, searchTerm]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="bg-[#fcfdfe] min-h-screen pb-40 font-sans text-slate-900 pt-16 relative">
            <Navbar role="admin" />

            {/* --- MODAL SYSTEM (SIMPLE CONFIRMATION) --- */}
            {modal.show && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setModal({ ...modal, show: false })}></div>
                    <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
                        <div className={`w-12 h-12 rounded-2xl mb-5 flex items-center justify-center ${modal.type === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                            {modal.type === 'danger' ? <AlertTriangle size={24}/> : <Info size={24}/>}
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tight mb-2 leading-none">{modal.title}</h2>
                        <p className="text-slate-400 text-[10px] font-bold leading-relaxed mb-8 uppercase tracking-widest">{modal.desc}</p>
                        
                        <div className="flex gap-2">
                            <button onClick={() => setModal({ ...modal, show: false })} className="flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
                            <button 
                                onClick={modal.action} 
                                className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white transition-all shadow-lg active:scale-95 ${modal.type === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TOAST SYSTEM --- */}
            {toast.show && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] animate-in slide-in-from-top-5">
                    <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 text-white shadow-xl border border-white/10">
                        <CheckCircle size={16} className="text-emerald-400"/>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em]">{toast.msg}</p>
                    </div>
                </div>
            )}
            
            <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-8">
                <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 border-b border-slate-100 pb-10">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter">Master <span className="text-blue-600">Vault</span></h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Historical Forward Logs</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                        <div className="relative flex-1 xl:flex-none xl:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                            <input type="text" placeholder="FILTER..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-[10px] font-bold outline-none uppercase focus:ring-4 focus:ring-blue-50 transition-all" />
                        </div>
                        
                        <button 
                            onClick={() => setModal({ show: true, title: "Initialize Export?", desc: `Compile ${leads.length} data nodes?`, type: "info", action: executeDownload })} 
                            disabled={exporting || leads.length === 0} 
                            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[10px] font-black transition-all ${leads.length === 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg active:scale-95'}`}
                        >
                            {exporting ? <Loader2 className="animate-spin" size={14}/> : <Download size={14} />} Export
                        </button>

                        <button 
                            onClick={() => setModal({ show: true, title: "Clear Vault?", desc: "Permanent erasure of archived records.", type: "danger", action: executePurge })} 
                            disabled={leads.length === 0} 
                            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[10px] font-black transition-all ${leads.length === 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white'}`}
                        >
                            <Trash2 size={14} /> Wipe Vault
                        </button>

                        <button onClick={() => navigate("/admin")} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black shadow-lg hover:bg-blue-600 transition-all">
                            <ArrowLeft size={14} /> Back
                        </button>
                    </div>
                </header>

                {/* --- RESTORED EMPTY STATE --- */}
                {leads.length === 0 && (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-8 flex flex-col items-center text-center animate-in fade-in duration-700">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                            <Archive size={24} className="text-blue-200" />
                        </div>
                        <h3 className="text-sm font-black uppercase text-blue-900 tracking-tight">Vault is Empty</h3>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">New forwarded leads will appear here automatically</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredLeads.map((l) => (
                        <div key={l._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between min-h-[200px]">
                            <div>
                                <div className="flex justify-between items-start mb-5">
                                    <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[8px] font-black uppercase border border-blue-100 flex items-center gap-1">
                                        <UserIcon size={10} /> {l.fromUser?.username || "Agent"}
                                    </div>
                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{new Date(l.forwardedAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-sm font-black uppercase text-slate-900 truncate mb-1">{l.display_name}</h3>
                                <p className="text-[10px] font-mono font-bold text-slate-400">{l.display_phone}</p>
                            </div>
                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest truncate max-w-[120px]">{l.sourceFile}</p>
                                <FileText size={16} className="text-slate-100 group-hover:text-blue-100 transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
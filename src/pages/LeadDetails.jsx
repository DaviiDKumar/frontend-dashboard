import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

// Icons
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const CrossIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>;

export default function LeadDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLeads();
    }, [id]);

    const fetchLeads = async () => {
        try {
            const res = await API.get(`/files/view/${id}`);
            // Filter out 'pending' status leads from this specific batch view
            setLeads(res.data.leads || []);
            setFileName(res.data.fileName || "Batch Data");
        } catch (err) {
            navigate("/user");
        } finally {
            setLoading(false);
        }
    };

    const updateLeadStatus = async (leadId, newStatus) => {
        try {
            // API Call
            await API.patch(`/files/status/${leadId}`, { status: newStatus });
            
            // If marked as pending, remove from local list with animation delay
            if (newStatus === 'pending') {
                setLeads(prev => prev.map(l => l._id === leadId ? { ...l, exiting: true } : l));
                setTimeout(() => {
                    setLeads(prev => prev.filter(l => l._id !== leadId));
                }, 400);
            } else {
                setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
            }
        } catch (err) {
            console.error("Update failed");
        }
    };

    const activeLeads = useMemo(() => {
        return leads.filter(l => l.status !== 'pending');
    }, [leads]);

    const filteredLeads = useMemo(() => {
        return activeLeads.filter((l) =>
            Object.values(l).some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [activeLeads, searchTerm]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-white text-[10px] font-black tracking-[0.4em] text-slate-400">SYNCING BATCH...</div>;

    return (
        <div className="flex h-screen flex-col bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
            <header className="z-50 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <button onClick={() => navigate("/user")} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><ArrowLeft /></button>
                    
                    <div className="flex-1 min-w-0">
                        <h1 className="text-sm font-black uppercase truncate tracking-tight">{fileName}</h1>
                        <button 
                            onClick={() => navigate("/user/pending")}
                            className="text-[9px] font-bold text-amber-500 hover:text-amber-600 uppercase tracking-widest mt-1 flex items-center gap-1"
                        >
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                            View Follow-up Queue
                        </button>
                    </div>

                    <div className="relative w-32 sm:w-60">
                        <input type="text" placeholder="SEARCH..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 border-none rounded-xl py-2 pl-9 pr-3 text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-3">
                    {filteredLeads.map((lead, idx) => (
                        <div 
                            key={lead._id} 
                            className={`flex items-center gap-4 p-4 rounded-[2rem] border transition-all duration-500 
                            ${lead.exiting ? 'opacity-0 scale-95 -translate-x-10' : 'opacity-100 scale-100'}
                            ${lead.status === 'done' ? 'bg-emerald-50/40 border-emerald-100' : 'bg-white border-white shadow-sm'}`}
                        >
                            <div className="flex-1 min-w-0">
                                <h3 className={`text-sm font-black uppercase ${lead.status === 'done' ? 'text-slate-400 line-through' : ''}`}>{lead.full_name}</h3>
                                <div className="flex gap-x-4 text-[10px] font-bold text-slate-400 uppercase">
                                    <span>{lead.phone_number}</span>
                                    <span>{lead.city}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={() => updateLeadStatus(lead._id, 'done')} 
                                    className={`h-9 w-9 rounded-xl flex items-center justify-center border-2 transition-all ${lead.status === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-100 text-slate-200 hover:border-emerald-200'}`}><CheckIcon /></button>
                                
                                <button onClick={() => updateLeadStatus(lead._id, 'pending')} 
                                    className="h-9 w-9 rounded-xl flex items-center justify-center border-2 bg-white border-slate-100 text-slate-200 hover:bg-amber-500 hover:border-amber-500 hover:text-white transition-all"><ClockIcon /></button>
                                
                                <button onClick={() => updateLeadStatus(lead._id, 'rejected')} 
                                    className={`h-9 w-9 rounded-xl flex items-center justify-center border-2 transition-all ${lead.status === 'rejected' ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-slate-100 text-slate-200 hover:border-rose-200'}`}><CrossIcon /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
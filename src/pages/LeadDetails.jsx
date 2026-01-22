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
            
            // Clean phone numbers by removing "p:" prefix
            const cleanedLeads = (res.data.leads || []).map(lead => ({
                ...lead,
                phone_number: lead.phone_number?.startsWith('p:') 
                    ? lead.phone_number.replace('p:', '') 
                    : lead.phone_number
            }));

            setLeads(cleanedLeads);
            setFileName(res.data.fileName || "Batch Data");
        } catch (err) {
            navigate("/user");
        } finally {
            setLoading(false);
        }
    };

    const updateLeadStatus = async (leadId, newStatus) => {
        try {
            await API.patch(`/files/status/${leadId}`, { status: newStatus });
            
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

    if (loading) return <div className="h-screen flex items-center justify-center bg-white text-[10px] font-black tracking-[0.4em] text-blue-600">INITIALIZING_BATCH...</div>;

    return (
        <div className="flex h-screen flex-col pt-15 bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
            <header className="z-50 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
                    <button onClick={() => navigate("/user")} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-blue-600">
                        <ArrowLeft />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xs font-black uppercase truncate tracking-widest text-slate-900">{fileName}</h1>
                        <button 
                            onClick={() => navigate("/user/pending")}
                            className="text-[8px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-[0.2em] mt-1 flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                            Access Follow-up Terminal
                        </button>
                    </div>

                    <div className="relative w-40 sm:w-72 group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                            <SearchIcon />
                        </div>
                        <input 
                            type="text" 
                            placeholder="FILTER DATA..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all uppercase placeholder:text-slate-300" 
                        />
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-5xl mx-auto grid grid-cols-1 gap-4">
                    {filteredLeads.map((lead) => (
                        <div 
                            key={lead._id} 
                            className={`flex flex-col sm:flex-row sm:items-center gap-4 p-6 rounded-[2rem] border transition-all duration-500 
                            ${lead.exiting ? 'opacity-0 scale-95 -translate-x-10' : 'opacity-100 scale-100'}
                            ${lead.status === 'done' ? 'bg-emerald-50/30 border-emerald-100 shadow-none' : 'bg-white border-white shadow-sm hover:shadow-md'}`}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className={`text-sm font-black uppercase tracking-tight ${lead.status === 'done' ? 'text-slate-300 line-through' : 'text-slate-900'}`}>
                                        {lead.full_name}
                                    </h3>
                                    {lead.status === 'rejected' && (
                                        <span className="text-[8px] font-black bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full uppercase tracking-widest">Rejected</span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] font-bold text-slate-700 uppercase font-mono">
                                    <span className="flex items-center gap-1.5">
                                        {lead.phone_number}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-green-600">
                                        <span className="text-black">LOC:</span>{lead.city}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:pl-4 sm:border-l border-slate-50">
                                {/* Done Button */}
                                <button onClick={() => updateLeadStatus(lead._id, 'done')} 
                                    className={`h-11 w-11 rounded-2xl flex items-center justify-center border-2 transition-all active:scale-90
                                    ${lead.status === 'done' 
                                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                                        : 'bg-white border-slate-100 text-slate-200 hover:border-emerald-500 hover:text-emerald-500'}`}>
                                    <CheckIcon />
                                </button>
                                
                                {/* Pending Button */}
                                <button onClick={() => updateLeadStatus(lead._id, 'pending')} 
                                    className="h-11 w-11 rounded-2xl flex items-center justify-center border-2 bg-white border-slate-100 text-slate-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all active:scale-90 shadow-sm shadow-blue-100/20">
                                    <ClockIcon />
                                </button>
                                
                                {/* Rejected Button */}
                                <button onClick={() => updateLeadStatus(lead._id, 'rejected')} 
                                    className={`h-11 w-11 rounded-2xl flex items-center justify-center border-2 transition-all active:scale-90
                                    ${lead.status === 'rejected' 
                                        ? 'bg-rose-500 border-rose-500 text-white' 
                                        : 'bg-white border-slate-100 text-slate-200 hover:border-rose-500 hover:text-rose-500'}`}>
                                    <CrossIcon />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredLeads.length === 0 && !loading && (
                        <div className="py-20 text-center space-y-4">
                            <div className="text-slate-200 flex justify-center"><SearchIcon /></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">No matching data nodes found</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

// Icons
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m12 19-7-7 7-7M19 12H5" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;

export default function PendingLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await API.get("/files/my-pending");
                setLeads(res.data.leads || []);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
    }, []);

    // Function to mark a follow-up as DONE and remove it from this list
    const markAsDone = async (leadId) => {
        try {
            // Optimistic UI: Start exit animation
            setLeads(prev => prev.map(l => l._id === leadId ? { ...l, exiting: true } : l));
            
            // Update Backend
            await API.patch(`/files/status/${leadId}`, { status: "done" });
            
            // Remove from local state after animation
            setTimeout(() => {
                setLeads(prev => prev.filter(l => l._id !== leadId));
            }, 400);
        } catch (err) {
            console.error("Failed to complete lead:", err);
        }
    };

    const filteredLeads = useMemo(() => {
        return leads.filter((l) =>
            Object.values(l).some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [leads, searchTerm]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#F8FAFC] text-[10px] font-black tracking-widest text-slate-400 uppercase">Syncing Follow-ups...</div>;

    return (
        <div className="flex h-screen flex-col bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
            <header className="z-50 border-b border-slate-200 bg-white px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/user")} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><ArrowLeft /></button>
                        <div>
                            <h1 className="text-sm font-black uppercase tracking-tight leading-none">Pending Queue</h1>
                            <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mt-1">{leads.length} LEADS TO CLEAR</p>
                        </div>
                    </div>
                    <div className="relative w-32 sm:w-64">
                        <input type="text" placeholder="SEARCH PENDING..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 border-none rounded-xl py-2 pl-9 pr-3 text-[10px] font-bold outline-none focus:ring-2 focus:ring-amber-100 transition-all" />
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-3">
                    {filteredLeads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 opacity-30">
                            <CheckIcon />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-4">Queue Cleared</p>
                        </div>
                    ) : (
                        filteredLeads.map((lead) => (
                            <div 
                                key={lead._id} 
                                className={`bg-white p-4 rounded-[2.5rem] border border-white shadow-sm flex items-center justify-between gap-4 transition-all duration-500 
                                ${lead.exiting ? 'opacity-0 scale-95 translate-x-10' : 'opacity-100 scale-100'}`}
                            >
                                <div className="min-w-0 flex-1 ml-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-black uppercase rounded-md">Follow Up</span>
                                        <span className="text-[9px] font-bold text-slate-300 uppercase truncate">{lead.fileName}</span>
                                    </div>
                                    <h3 className="text-sm font-black uppercase text-slate-900 truncate">{lead.full_name}</h3>
                                    <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                                        <a href={`tel:${lead.phone_number}`} className="text-blue-600 hover:underline">{lead.phone_number}</a>
                                        <span>{lead.city}</span>
                                    </div>
                                </div>

                                {/* THE TICK BOX BUTTON */}
                                <button 
                                    onClick={() => markAsDone(lead._id)} 
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center border-4 border-slate-50 bg-slate-50 text-slate-200 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50 transition-all duration-300 active:scale-90"
                                    title="Mark as Completed"
                                >
                                    <CheckIcon />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
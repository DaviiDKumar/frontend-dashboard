import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

// Icons
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;

export default function LeadDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [completedLeads, setCompletedLeads] = useState([]);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await API.get(`/files/view/${id}`);
                const cleanedLeads = (res.data.leads || []).map(l => ({
                    _id: l._id,
                    full_name: l.full_name,
                    email: l.email,
                    phone_number: l.phone_number,
                    city: l.city
                }));
                setLeads(cleanedLeads);
                setFileName(res.data.fileName || "Database");
                const saved = JSON.parse(localStorage.getItem(`done_${id}`)) || [];
                setCompletedLeads(saved);
            } catch (err) {
                   console.error("Lead Fetch Error:", err); 
                navigate("/user");
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, [id, navigate]);

    const toggleStatus = (leadId) => {
        const updated = completedLeads.includes(leadId)
            ? completedLeads.filter(i => i !== leadId)
            : [...completedLeads, leadId];
        setCompletedLeads(updated);
        localStorage.setItem(`done_${id}`, JSON.stringify(updated));
    };

    const filteredLeads = useMemo(() => {
        return leads.filter((l) =>
            Object.values(l).some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [leads, searchTerm]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-white text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase">Syncing Matrix...</div>;

    return (
        <div className="flex h-screen flex-col bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">

            {/* --- COMPACT GLASS HEADER --- */}
            <header className="z-50 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <button onClick={() => navigate("/user")} className="p-2 hover:bg-slate-100 rounded-xl transition-all active:scale-90">
                        <ArrowLeft />
                    </button>

                    <div className="flex-1 min-w-0">
                        <h1 className="text-sm font-black uppercase truncate tracking-tight leading-none">{fileName}</h1>
                        <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                            {completedLeads.length} / {leads.length} DONE
                        </p>
                    </div>

                    <div className="relative w-32 sm:w-60">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none opacity-40">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="SEARCH..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 border-none rounded-xl py-2 pl-9 pr-3 text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>
                </div>
            </header>

            {/* --- SLIM CARD LIST --- */}
            <main className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-3">
                    {filteredLeads.map((lead, idx) => {
                        const isDone = completedLeads.includes(lead._id);
                        return (
                            <div
                                key={lead._id || idx}
                                className={`flex items-center gap-4 p-4 rounded-3xl border transition-all duration-300 ${isDone ? 'border-emerald-100 bg-emerald-50/40 opacity-70' : 'bg-white border-white shadow-sm hover:shadow-md hover:border-blue-100'}`}
                            >
                                {/* ID Badge */}
                                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-black shadow-sm ${isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-900 text-white'}`}>
                                    {String(idx + 1).padStart(2, '0')}
                                </div>

                                {/* Lead Information */}
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-sm font-black uppercase truncate tracking-tight ${isDone ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                        {lead.full_name}
                                    </h3>

                                    <div className="flex flex-wrap gap-x-4 mt-1">
                                        <a href={`tel:${lead.phone_number}`} className="text-[10px] font-extrabold text-blue-600 hover:underline">
                                            {lead.phone_number}
                                        </a>
                                        <a href={`mailto:${lead.email}`} className="text-[10px] font-bold text-slate-900 truncate max-w-[150px] hover:text-blue-600 transition-colors">
                                            {lead.email}
                                        </a>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase hidden sm:inline">
                                            {lead.city}
                                        </span>
                                    </div>
                                </div>

                                {/* TICK BOX TOGGLE */}
                                <button
                                    onClick={() => toggleStatus(lead._id)}
                                    className={`flex-shrink-0 h-11 w-11 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${isDone
                                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100 scale-110'
                                            : 'bg-white border-slate-200 text-slate-300 hover:border-emerald-400 hover:text-emerald-400 active:scale-90'
                                        }`}
                                >
                                    <CheckIcon />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* --- MINIMAL PROGRESS BAR --- */}
            <footer className="bg-white border-t border-slate-100 px-6 py-3 flex items-center gap-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {Math.round((completedLeads.length / (leads.length || 1)) * 100)}% COMPLETE
                </p>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-700 ease-out"
                        style={{ width: `${(completedLeads.length / (leads.length || 1)) * 100}%` }}
                    ></div>
                </div>
            </footer>
        </div>
    );
}
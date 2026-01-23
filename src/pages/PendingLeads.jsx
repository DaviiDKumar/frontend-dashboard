import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { 
    ArrowLeft, CheckCircle2, Forward, Search, Loader2, 
    Undo2, X, CheckSquare, Square, Inbox 
} from "lucide-react";

export default function PendingLeads() {
    const [leads, setLeads] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Undo & Countdown States
    const [lastAction, setLastAction] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const countdownInterval = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPending();
        checkPersistedAction();
        return () => clearInterval(countdownInterval.current);
    }, []);

    const fetchPending = async () => {
        try {
            const res = await API.get("/files/my-pending");
            const formatted = (res.data.leads || []).map(l => ({
                ...l,
                display_name: l.data?.["full name"] || l.data?.full_name || l.full_name || "N/A",
                display_phone: String(l.data?.["phone number"] || l.data?.phone_number || "N/A").replace('p:', '').trim(),
                hidden: false
            }));
            setLeads(formatted);
        } catch (err) { console.error("Fetch failed"); } 
        finally { setLoading(false); }
    };

    // --- SELECTION LOGIC ---
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredLeads.length) setSelectedIds([]);
        else setSelectedIds(filteredLeads.map(l => l._id));
    };

    const toggleLead = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    // --- ACTION ENGINE ---
    const handleAction = async (target, type) => {
        // Force commit previous action if one exists
        if (lastAction) await executeFinalAction(lastAction);

        const ids = Array.isArray(target) ? target : [target._id];
        const actionObj = { ids, type, timestamp: Date.now() };
        
        localStorage.setItem("pending_undo", JSON.stringify(actionObj));
        // Hide immediately in UI
        setLeads(prev => prev.map(l => ids.includes(l._id) ? { ...l, hidden: true } : l));
        setLastAction(actionObj);
        setSelectedIds([]);
        startCountdown(60, actionObj);
    };

    const executeFinalAction = async (action) => {
        try {
            if (action.type === 'done') {
                await Promise.all(action.ids.map(id => API.patch(`/files/status/${id}`, { status: "done" })));
            } else {
                // NEW DECOUPLED ARCHIVE ROUTE
                await API.post("/archive/forward-to-admin", { leadIds: action.ids });
            }
            setLeads(prev => prev.filter(l => !action.ids.includes(l._id)));
        } catch (err) { console.error("Commit failed", err); }
        finally {
            setLastAction(null);
            localStorage.removeItem("pending_undo");
        }
    };

    const checkPersistedAction = () => {
        const saved = localStorage.getItem("pending_undo");
        if (saved) {
            const action = JSON.parse(saved);
            const remaining = 60 - Math.floor((Date.now() - action.timestamp) / 1000);
            if (remaining > 0) {
                setLastAction(action);
                startCountdown(remaining, action);
            } else executeFinalAction(action);
        }
    };

    const startCountdown = (seconds, action) => {
        setTimeLeft(seconds);
        clearInterval(countdownInterval.current);
        countdownInterval.current = setInterval(() => {
            setTimeLeft(p => {
                if (p <= 1) {
                    clearInterval(countdownInterval.current);
                    executeFinalAction(action);
                    return 0;
                }
                return p - 1;
            });
        }, 1000);
    };

    const filteredLeads = useMemo(() => 
        leads.filter(l => !l.hidden && l.display_name.toLowerCase().includes(searchTerm.toLowerCase())), 
    [leads, searchTerm]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" size={32}/></div>;

    return (
        <div className="relative flex h-screen flex-col bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden pt-16">
            <header className="z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/user")} className="p-2 hover:bg-slate-100 rounded-full transition-all cursor-pointer"><ArrowLeft size={20}/></button>
                    <h1 className="text-sm font-black uppercase tracking-tight">Terminal <span className="text-blue-600">Pending</span></h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input 
                            type="text" placeholder="FILTER..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-50 border border-slate-100 rounded-full py-2 pl-10 pr-4 text-[10px] font-bold outline-none uppercase w-40 sm:w-64 focus:ring-4 focus:ring-blue-50 transition-all" 
                        />
                    </div>
                    <button onClick={toggleSelectAll} className="p-2.5 bg-slate-100 rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                        {selectedIds.length === filteredLeads.length && filteredLeads.length > 0 ? <CheckSquare size={18}/> : <Square size={18}/>}
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
                <div className="max-w-4xl mx-auto space-y-3">
                    {filteredLeads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-40 opacity-20"><Inbox size={48} /><p className="text-[10px] font-black uppercase mt-4">Buffer_Empty</p></div>
                    ) : (
                        filteredLeads.map((l) => (
                            <div key={l._id} className={`bg-white p-5 rounded-[2.5rem] border transition-all flex items-center gap-4 ${selectedIds.includes(l._id) ? 'border-blue-500 ring-4 ring-blue-50' : 'border-white shadow-sm'}`}>
                                <button onClick={() => toggleLead(l._id)} className="cursor-pointer text-slate-200 hover:text-blue-500 transition-all">
                                    {selectedIds.includes(l._id) ? <CheckSquare className="text-blue-600" size={22}/> : <Square size={22}/>}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-black uppercase truncate">{l.display_name}</h3>
                                    <p className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">{l.display_phone}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleAction(l, 'done')} className="w-10 h-10 rounded-full border border-emerald-50 bg-white flex items-center justify-center text-emerald-300 hover:text-emerald-500 transition-all active:scale-90 cursor-pointer shadow-sm"><CheckCircle2 size={20} strokeWidth={2.5}/></button>
                                    <button onClick={() => handleAction(l, 'forward')} className="w-10 h-10 rounded-full border border-purple-50 bg-white flex items-center justify-center text-purple-300 hover:text-purple-500 transition-all active:scale-90 cursor-pointer shadow-sm"><Forward size={20} strokeWidth={2.5}/></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* --- BULK ACTION BAR --- */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-10">
                    <p className="text-[10px] font-black uppercase tracking-widest">{selectedIds.length} Nodes Selected</p>
                    <div className="h-4 w-px bg-white/20"></div>
                    <div className="flex gap-6">
                        <button onClick={() => handleAction(selectedIds, 'forward')} className="flex items-center gap-2 text-[10px] font-black uppercase text-purple-400 hover:text-purple-300 cursor-pointer"><Forward size={16}/> Flush Batch</button>
                        <button onClick={() => handleAction(selectedIds, 'done')} className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-400 hover:text-emerald-300 cursor-pointer"><CheckCircle2 size={16}/> Mark Done</button>
                    </div>
                </div>
            )}

            {/* --- UNDO OVERLAY --- */}
            {lastAction && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-md">
                    <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-white/10 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / 60) * 100}%` }}></div>
                        <div className="flex items-center gap-3 z-10 pl-2">
                            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">{timeLeft}s</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest">Syncing to Archive</p>
                        </div>
                        <div className="flex items-center gap-2 z-10">
                            <button onClick={() => { clearInterval(countdownInterval.current); setLeads(prev => prev.map(l => lastAction.ids.includes(l._id) ? {...l, hidden: false} : l)); setLastAction(null); localStorage.removeItem("pending_undo"); }} className="bg-white/10 hover:bg-white hover:text-slate-900 px-5 py-2 rounded-2xl text-[10px] font-black uppercase cursor-pointer">Undo</button>
                            <button onClick={() => { clearInterval(countdownInterval.current); executeFinalAction(lastAction); }} className="p-2 text-slate-500 hover:text-white cursor-pointer transition-colors"><X size={20}/></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
    const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to connect to your backend /api/public/inquiry can go here
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* --- HEADER SECTION --- */}
                <div className="mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 mb-6"
                    >
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">Support Terminal</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
                        Get in <span className="text-blue-600">Touch.</span>
                    </h1>
                    <p className="text-slate-500 mt-6 text-lg max-w-2xl font-medium leading-relaxed">
                        Have questions about our partnership with FreelanceWave or looking to join our team? Use the terminal below to reach our specialists.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    {/* --- LEFT: CONTACT INFO --- */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="space-y-8">
                            <div className="group flex items-start gap-6">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Official Email</p>
                                    <p className="text-lg font-black text-slate-900 uppercase">support@datatech.in</p>
                                </div>
                            </div>

                            <div className="group flex items-start gap-6">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Direct Line</p>
                                    <p className="text-lg font-black text-slate-900 uppercase">+91 98765 43210</p>
                                </div>
                            </div>

                            <div className="group flex items-start gap-6">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hub Location</p>
                                    <p className="text-lg font-black text-slate-900 uppercase leading-tight">Sector 10, Malviya Nagar<br />Jaipur, RJ 302017</p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Help Card */}
                        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <MessageSquare className="text-blue-400 mb-6" size={32} />
                            <h4 className="text-xl font-black uppercase tracking-tight mb-2">Live Chat Coming Soon</h4>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed uppercase tracking-wider">
                                We are currently integrating a live support channel for our authorized partners.
                            </p>
                        </div>
                    </div>

                    {/* --- RIGHT: INTAKE FORM --- */}
                    <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[3rem] border border-white shadow-xl shadow-slate-200/50">
                        {isSubmitted ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center py-20"
                            >
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                    <Send size={32} />
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Data Transmitted</h3>
                                <p className="text-slate-400 font-medium mt-2 uppercase text-[10px] tracking-widest">Our agents will review your inquiry shortly.</p>
                                <button onClick={() => setIsSubmitted(false)} className="mt-8 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">Send Another Message</button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
                                        <input 
                                            type="text" 
                                            placeholder="NAME / BUSINESS"
                                            className="w-full bg-slate-50 border-none rounded-2xl p-5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Digital Address</label>
                                        <input 
                                            type="email" 
                                            placeholder="EMAIL@EXAMPLE.COM"
                                            className="w-full bg-slate-50 border-none rounded-2xl p-5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inquiry Type</label>
                                    <select className="w-full bg-slate-50 border-none rounded-2xl p-5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none">
                                        <option>WORK PARTNERSHIP INQUIRY</option>
                                        <option>CAREER OPPORTUNITIES</option>
                                        <option>TECHNICAL TERMINAL SUPPORT</option>
                                        <option>BILLING & PAYOUTS</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Message</label>
                                    <textarea 
                                        rows="5"
                                        placeholder="HOW CAN WE ASSIST YOUR PROGRESS?"
                                        className="w-full bg-slate-50 border-none rounded-2xl p-5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                                        required
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit"
                                    className="group w-full bg-slate-900 text-white p-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all duration-500 shadow-xl shadow-slate-200 active:scale-[0.98]"
                                >
                                    Transmit Inquiry
                                    <Send size={16} className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
import { motion } from 'framer-motion';
import { ArrowRight, Command, CheckCircle2, Globe, Cpu, Zap } from 'lucide-react';

export default function CareersSection() {
  return (
    <section className="relative min-h-screen bg-white text-slate-900 py-24 md:py-40 px-6 overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 bg-blue-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-50" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- 01. MAIN HEADING --- */}
        <header className="mb-20 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 text-blue-600 mb-8"
          >
            <Cpu size={18} className="animate-pulse" />
            <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] font-mono">Recruitment_Active_2026</span>
          </motion.div>
          
          <h1 className="text-[14vw] md:text-[9rem] font-black uppercase tracking-tighter leading-[0.8] mb-10 text-black">
            We are <br /> <span className="text-blue-600 italic font-light tracking-tight">Hiring.</span>
          </h1>
        </header>

        {/* --- 02. ROLE SPECIFICATIONS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start">
          
          {/* Left Column: Description & Details */}
          <div className="lg:col-span-7 space-y-16">
            <section>
              <div className="flex items-center gap-4 text-slate-200 mb-10">
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Position_Node</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-black mb-8 leading-none">
                Tele-Calling <br /> Specialist.
              </h2>
              <p className="text-xl md:text-3xl text-slate-700 leading-[1.6] font-medium tracking-tight">
                We are integrating specialized professionals into our synchronized data grid. You will manage high-frequency lead processing by verifying user data through the <span className="text-blue-600 font-bold">FreelanceWave</span> pipeline. This role requires verbal precision and provides guaranteed <span className="text-emerald-500 font-bold">weekly payouts</span>.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-4 text-slate-200 mb-10">
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Protocol_Requirements</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                {[
                  "Jaipur Resident (Sector 10)",
                  "Basic Terminal Navigation",
                  "Clear Verbal Communication",
                  "Verified Identity (Aadhar)",
                  "Active Bank Account",
                  "4-8 Hour Daily Shifts"
                ].map((item, i) => (
                  <motion.li 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    key={i} 
                    className="flex items-center gap-4 border-b border-slate-50 pb-4"
                  >
                    <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                    <span className="text-sm md:text-lg font-bold text-slate-800 uppercase tracking-tight">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Column: Enrollment Form */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xl font-black uppercase tracking-tighter">Enrollment_Form</h3>
                <Zap size={20} className="text-blue-600" />
              </div>
              
              <form className="space-y-10">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal_Identity</label>
                  <input type="text" className="w-full bg-transparent border-b-2 border-slate-200 py-4 text-lg font-bold outline-none focus:border-blue-600 transition-all uppercase placeholder:text-slate-200" placeholder="FULL NAME" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Signal_Contact</label>
                  <input type="tel" className="w-full bg-transparent border-b-2 border-slate-200 py-4 text-lg font-bold outline-none focus:border-blue-600 transition-all uppercase placeholder:text-slate-200" placeholder="+91 XXXX" />
                </div>

                <button className="relative w-full py-8 md:py-10 bg-black text-white rounded-2xl overflow-hidden group transition-all active:scale-[0.98] shadow-xl">
                  <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.5em] group-hover:text-white flex items-center justify-center gap-6">
                    Initialize Apply <ArrowRight size={20} />
                  </span>
                </button>
              </form>

              <div className="mt-10 flex items-center justify-center gap-6 opacity-30">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Secure_Link</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Node_Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SYSTEM LOG FOOTER --- */}
        <footer className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
          <div className="flex gap-10">
            <span className="flex items-center gap-2 text-slate-900"><div className="w-1 h-1 bg-blue-600 rounded-full" /> Jaipur_Node_302017</span>
            <span className="flex items-center gap-2"><Globe size={12} className="text-blue-500" /> Synced_Protocol_V2</span>
          </div>
          <p>DATATECH_ENROLMENT_SYSTEM_2026</p>
        </footer>
      </div>
    </section>
  );
}
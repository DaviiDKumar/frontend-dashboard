import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, UserPlus, HelpCircle, Activity, Globe, Zap, Cpu } from "lucide-react";

export default function CTASection() {
  const navigate = useNavigate();

  // Animation variants for the container and children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.3 } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="relative py-32 px-6 bg-white overflow-hidden">
      {/* Background Texture: Architectural Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200"
            >
                <Cpu size={12} className="text-blue-600" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 font-mono">Terminal_Selection_v2</span>
            </motion.div>
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Choose <br /> <span className="text-blue-600">Entry.</span>
            </h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm md:text-base font-medium max-w-xs border-l border-slate-200 pl-6 leading-relaxed"
          >
            Connect your credentials to the Jaipur grid or establish a support link with our hub specialists.
          </motion.p>
        </div>

        {/* --- DUAL TERMINAL CARDS --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          
          {/* --- LEFT STATION: RECRUITMENT --- */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -12 }}
            className="bg-[#F9FBFF] p-10 md:p-16 rounded-[3.5rem] border border-blue-100 flex flex-col justify-between min-h-[550px] relative overflow-hidden group shadow-sm transition-shadow duration-700 hover:shadow-2xl hover:shadow-emerald-500/10"
          >
            <div className="space-y-10 relative z-10">
              <div className="flex justify-between items-start">
                <motion.div 
                  whileHover={{ rotate: 15 }}
                  className="w-16 h-16 rounded-3xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-emerald-500"
                >
                  <UserPlus size={32} />
                </motion.div>
                <div className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-2">
                   <Activity size={12} className="animate-pulse" />
                   <span className="text-[8px] font-black uppercase tracking-widest font-mono">Live_Hiring</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                  Apply <br /> <span className="text-emerald-500 italic font-light tracking-tight">Position.</span>
                </h3>
                <p className="text-slate-500 text-lg font-medium max-w-sm leading-relaxed">
                  Join Jaipur's highest performing tele-calling synchronized workforce.
                </p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/careers')}
              className="mt-12 group/btn relative flex items-center justify-between w-full p-7 bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-500 active:scale-95"
            >
              <div className="absolute inset-0 bg-emerald-500 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              <span className="relative z-10 text-slate-900 font-black uppercase text-[11px] tracking-[0.4em] group-hover/btn:text-white transition-colors duration-500">Initialize_Application</span>
              <ArrowRight size={20} className="relative z-10 text-slate-300 group-hover/btn:text-white group-hover/btn:translate-x-2 transition-all" />
            </button>

            <Zap size={240} className="absolute -bottom-16 -right-16 text-emerald-500/[0.03] group-hover:text-emerald-500/[0.08] group-hover:rotate-12 transition-all duration-1000 pointer-events-none" />
          </motion.div>

          {/* --- RIGHT STATION: SUPPORT --- */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -12 }}
            className="bg-[#F8FAFC] p-10 md:p-16 rounded-[3.5rem] border border-slate-200 flex flex-col justify-between min-h-[550px] relative overflow-hidden group shadow-sm transition-shadow duration-700 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div className="space-y-10 relative z-10">
              <div className="flex justify-between items-start">
                <motion.div 
                  whileHover={{ rotate: -15 }}
                  className="w-16 h-16 rounded-3xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-blue-600"
                >
                  <HelpCircle size={32} />
                </motion.div>
                <div className="text-right">
                  <p className="text-[8px] font-mono text-blue-400 uppercase tracking-widest font-black">Link_Support</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                  Inquiry <br /> <span className="text-blue-600 italic font-light tracking-tight">Terminal.</span>
                </h3>
                <p className="text-slate-500 text-lg font-medium max-w-sm leading-relaxed">
                  Connect with a specialist for technical help or platform walkthroughs.
                </p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/contact')}
              className="mt-12 group/btn relative flex items-center justify-between w-full p-7 bg-slate-900 border border-slate-900 rounded-2xl overflow-hidden transition-all duration-500 active:scale-95 shadow-xl shadow-slate-200"
            >
              <div className="absolute inset-0 bg-blue-600 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              <span className="relative z-10 text-white font-black uppercase text-[11px] tracking-[0.4em]">Establish_Link</span>
              <ArrowRight size={20} className="relative z-10 text-white/40 group-hover/btn:text-white group-hover/btn:translate-x-2 transition-all" />
            </button>

            <Globe size={240} className="absolute -bottom-16 -right-16 text-blue-600/[0.03] group-hover:text-blue-600/[0.08] transition-all duration-1000 pointer-events-none" />
          </motion.div>

        </motion.div>

        {/* --- SYSTEM HUD LOGS --- */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
            <div className="flex items-center gap-10">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">Nodes: Active</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                    <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">Signal: Synced</span>
                </div>
            </div>
            <p className="text-[8px] font-mono text-slate-300 uppercase tracking-[0.8em] font-medium italic">Jaipur_Hub_Sector_302017</p>
        </div>

      </div>
    </section>
  );
}
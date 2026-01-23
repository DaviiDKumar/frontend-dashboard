import { motion } from "framer-motion";
import { ShieldCheck, MapPin, CreditCard, Zap, ArrowUpRight, Users, TrendingUp } from "lucide-react";

export default function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative bg-white py-20 md:py-32 px-4 md:px-6 overflow-hidden">
      {/* Fix: CSS Animation in a standard React-friendly style tag */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>

      {/* Background Polish */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- REFINED HEADER --- */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 md:mb-24 gap-6">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100"
            >
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700">Hub_Verified</span>
            </motion.div>
            <h2 className="text-5xl md:text-8xl font-black text-black uppercase tracking-tighter leading-[0.85]">
              Why Work <br /> <span className="text-blue-600">With Us?</span>
            </h2>
          </div>
          <p className="text-slate-500 text-base md:text-lg max-w-sm font-medium border-l-2 border-blue-600 pl-6 leading-relaxed">
            Building the premier terminal for high-performance tele-calling talent in Rajasthan.
          </p>
        </div>

        {/* --- DYNAMIC BENTO GRID --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(160px,auto)] md:auto-rows-[160px] gap-4 md:gap-6"
        >
          
          {/* 01. TRUST CARD */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-4 md:row-span-3 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-black text-white flex flex-col justify-between group relative overflow-hidden active:scale-[0.98] transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-blue-500 relative z-10">
              <ShieldCheck size={28} />
            </div>
            <div className="space-y-4 relative z-10">
              <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Safe <br /> Framework.</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Legally protected partnership. We ensure 100% compliance and secure data handling for all Rajasthan nodes.
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </motion.div>

          {/* 02. EARNINGS CARD */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-8 md:row-span-2 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-emerald-50 border border-emerald-100 flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-2">
                <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em]">Capital_Terminal</span>
                <h3 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-none">Weekly <br /> Payouts.</h3>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 hidden sm:block">
                <CreditCard className="text-emerald-600" size={32} />
              </div>
            </div>
            <div className="relative z-10 mt-8 md:mt-0">
                <p className="text-slate-600 max-w-sm font-medium text-sm leading-relaxed">
                  Earn up to <span className="text-emerald-700 font-black">₹25,000+ monthly</span>. Settlements are automated every Saturday.
                </p>
            </div>
            <TrendingUp size={120} className="absolute -right-4 -bottom-4 text-emerald-600/10 pointer-events-none" />
          </motion.div>

          {/* 03. HUB CARD */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-5 md:row-span-2 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-blue-600 text-white flex flex-col justify-between group shadow-xl shadow-blue-100 overflow-hidden"
          >
            <div className="flex justify-between items-center">
                <MapPin size={32} className="opacity-40 group-hover:rotate-12 transition-transform duration-500" />
                <div className="text-[9px] font-bold px-3 py-1 bg-white/10 rounded-full border border-white/20 uppercase tracking-widest">Jaipur_Sector</div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black uppercase tracking-tight leading-none">Regional <br /> Infrastructure.</h3>
              <p className="text-blue-50 text-xs md:text-sm font-medium">Malviya Nagar Hub. Full tech support & in-person onboarding for the local grid.</p>
            </div>
          </motion.div>

          {/* 04. GROWTH CARD */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-3 md:row-span-2 p-8 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 bg-slate-50 flex flex-col items-center justify-center text-center gap-6 group hover:bg-white transition-colors shadow-sm"
          >
            <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
              <Zap size={32} fill="currentColor" />
            </div>
            <div className="space-y-1">
                <h4 className="text-xl font-black text-black uppercase tracking-tighter leading-none">Rapid <br /> Career.</h4>
                <div className="h-1 w-8 bg-emerald-500 mx-auto rounded-full mt-4" />
            </div>
          </motion.div>

          {/* 05. NETWORK CARD */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-4 md:row-span-1 p-6 rounded-full border border-slate-200 bg-white flex items-center justify-between px-8 hover:border-black transition-all cursor-pointer group active:scale-95"
          >
            <div className="flex items-center gap-4">
                <Users size={18} className="text-blue-600" />
                <p className="text-[10px] font-black text-black uppercase tracking-[0.2em]">1,200+ Active Agents</p>
            </div>
            <ArrowUpRight size={18} className="text-slate-300 group-hover:text-black transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
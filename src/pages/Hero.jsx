import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Activity, Globe, Zap, ArrowUpRight, Command, Phone } from "lucide-react";
import HeroImage from "/home2.jpg"; 

export default function HeroSection() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const blurValue = useTransform(scrollYProgress, [0, 0.5], [0, 8]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center bg-[#02040a] overflow-hidden py-20">
      
      {/* LAYER 1: BACKDROP */}
      <motion.div style={{ scale: scaleImage, filter: `blur(${blurValue}px)` }} className="absolute inset-0 z-0 select-none pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#02040a_100%)] z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-[#02040a] z-10" />
        <img src={HeroImage} className="w-full h-full object-cover grayscale-[0.9] opacity-60 brightness-[1]" alt="Background" />
      </motion.div>

      {/* LAYER 2: GRID */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-20" 
           style={{ backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      {/* LAYER 3: CONTENT */}
      <motion.div style={{ y: yText, opacity }} className="relative z-30 px-6 md:px-16 max-w-[90rem] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 items-center">
            
            {/* LEFT: BRAND & TAGLINE */}
            <div className="space-y-8 md:space-y-12">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl">
                    <Command size={12} className="text-blue-500 animate-pulse" />
                    <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.5em] text-blue-400">System Protocol v2.4</span>
                </motion.div>

                <h1 className="flex flex-col text-[10vw] lg:text-[6.5rem] font-black text-white leading-[0.8] tracking-tighter uppercase select-none">
                    <motion.span initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>DATA TECH</motion.span>
                    <motion.span initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-400 to-blue-500 italic font-light tracking-normal">SERVICES</motion.span>
                </h1>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-slate-400 text-sm md:text-xl max-w-lg font-medium leading-relaxed tracking-tight">
                    Processing high-frequency leads for <span className="text-white">Jaipur's elite workforce.</span> <br/>
                    Deploy your skills on a synchronized global grid.
                </motion.p>
            </div>

            {/* RIGHT: ACTIONS */}
            <div className="flex flex-col items-center lg:items-end justify-center gap-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-col w-full sm:w-[350px] gap-4">
                    <button onClick={() => navigate('/login')} className="group relative w-full px-12 py-6 bg-white text-black rounded-sm font-black uppercase text-[10px] tracking-[0.3em] overflow-hidden transition-all duration-500 active:scale-95 cursor-pointer shadow-2xl">
                        <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative z-10 group-hover:text-white transition-colors duration-500 flex items-center justify-center gap-3">Initialize Session <ArrowUpRight size={14} /></span>
                    </button>
                    <button onClick={() => navigate('/contact')} className="w-full px-12 py-6 border border-slate-800 text-slate-400 rounded-sm font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-black hover:border-white transition-all duration-500 backdrop-blur-sm cursor-pointer flex items-center justify-center gap-3">
                        Contact Grid <Phone size={14} />
                    </button>
                </motion.div>
            </div>
        </div>
      </motion.div>
    </section>
  );
}
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Activity, Globe, Zap, ArrowUpRight, Command } from "lucide-react";
import HeroImage from "/home.jpg"; 

export default function HeroSection() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax and Visual transformations
  const yText = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const blurValue = useTransform(scrollYProgress, [0, 0.5], [0, 8]);

  // Disable pointer events when the text is mostly faded out (scrolled past 40%)
  const pointerEvents = useTransform(scrollYProgress, [0, 0.4], ["auto", "none"]);

  return (
    <section ref={containerRef} className="relative h-[110vh] flex items-center justify-center bg-[#02040a] overflow-hidden cursor-default">
      
      {/* --- LAYER 1: CINEMATIC BACKDROP --- */}
      <motion.div 
        style={{ scale: scaleImage, filter: `blur(${blurValue}px)` }}
        className="absolute inset-0 z-0 select-none pointer-events-none"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#02040a_100%)] z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-[#02040a] z-10" />
        <img 
          src={HeroImage} 
          alt="Technical Terminal" 
          className="w-full h-full object-cover grayscale-[0.9] opacity-40 brightness-[0.6]" 
        />
      </motion.div>

      {/* --- LAYER 2: TECHNICAL GRID OVERLAY --- */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-20" 
           style={{ backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      {/* --- LAYER 3: THE CONTENT --- */}
      <motion.div 
        style={{ y: yText, opacity, pointerEvents }}
        className="relative z-30 text-center px-6 max-w-7xl"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-10 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl"
        >
          <Command size={14} className="text-blue-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-400">
            Authorized System Access v2.4
          </span>
        </motion.div>

        {/* ULTRA PREMIUM TYPOGRAPHY */}
        <h1 className="flex flex-col text-[13vw] md:text-[11rem] font-black text-white leading-[0.75] tracking-tighter uppercase select-none">
          <motion.span 
            initial={{ x: -50, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ delay: 0.2, duration: 1 }}
            className="drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            DATA TECH
          </motion.span>
          <motion.span 
            initial={{ x: 50, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ delay: 0.4, duration: 1 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-400 to-blue-500 italic font-thin tracking-normal"
          >
            SERVICES
          </motion.span>
        </h1>

        <div className="mt-16 flex flex-col items-center">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-slate-400 text-lg md:text-xl max-w-xl font-medium leading-relaxed tracking-tight"
            >
                Processing high-frequency leads for 
                <span className="text-white"> Jaipur's elite workforce.</span> <br />
                Deploy your skills on a synchronized global grid.
            </motion.p>

            <div className="mt-14 flex flex-wrap justify-center gap-8">
                {/* PRIMARY ACTION */}
                <button 
                  onClick={() => navigate('/login')}
                  className="group relative px-14 py-6 bg-white text-black rounded-sm font-black uppercase text-[10px] tracking-[0.3em] overflow-hidden transition-all duration-500 active:scale-95 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500 flex items-center gap-3">
                    Initialize Session <ArrowUpRight size={14} />
                  </span>
                </button>

                {/* SECONDARY ACTION */}
                <button 
                  onClick={() => navigate('/careers')}
                  className="px-14 py-6 border border-slate-800 text-slate-400 rounded-sm font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-black hover:border-white transition-all duration-500 backdrop-blur-sm cursor-pointer"
                >
                  Deploy Skills
                </button>
            </div>
        </div>
      </motion.div>

      {/* --- LAYER 4: TELEMETRY FOOTER --- */}
      <div className="absolute bottom-0 left-0 w-full z-40 p-12 bg-gradient-to-t from-[#02040a] to-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-end gap-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 pointer-events-auto">
                {[
                  { label: "Sync_Index", val: "0x8824", icon: Zap },
                  { label: "Stability", val: "99.98%", icon: Activity },
                  { label: "Reach", val: "Global", icon: Globe },
                  { label: "Uptime", val: "324D", icon: Command }
                ].map((stat, i) => (
                  <div key={i} className="group cursor-help">
                    <div className="flex items-center gap-2 mb-2">
                        <stat.icon size={10} className="text-blue-500 group-hover:rotate-12 transition-transform" />
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                    <p className="text-xl font-mono text-white/80 font-light tabular-nums">{stat.val}</p>
                  </div>
                ))}
            </div>
            
            {/* LOCATION TAG */}
            <div className="flex flex-col items-end">
                <p className="text-[10px] font-mono text-blue-500/40 uppercase tracking-[0.5em] mb-3">JAIPUR_CORE_HUB</p>
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                          className="w-8 h-1 bg-blue-600 rounded-full" 
                        />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
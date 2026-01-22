import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, Instagram, MessageCircle, Mail, LogOut, ArrowRight } from 'lucide-react';
import API from "../api/axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Determine if we are in a Workspace/Terminal area
  const isWorkspace = location.pathname.startsWith('/user') || location.pathname.startsWith('/admin');

  const navLinks = [
    { name: 'Terminal Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Hiring Queue', href: '/careers' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/terms' },
  ];

  const internalLinks = [
    { name: "User Workspace", href: "/user", role: "user" },
    { name: "Admin Control", href: "/admin", role: "admin" },
    { name: "Pending Leads", href: "/user/pending", role: "user" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const handleLogout = async () => {
    try { await API.post("/auth/logout"); } 
    catch (err) { console.warn("Session cleared locally."); } 
    finally {
      localStorage.clear();
      setIsOpen(false);
      navigate("/", { replace: true });
    }
  };

  const isActive = (href) => location.pathname === href;

  // Dynamic colors based on scroll and location
  // If in workspace, we use a solid white small navbar style
  const navHeight = scrolled || isWorkspace ? 'h-16' : 'h-24';
  const navBg = scrolled || isWorkspace ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent';
  const textPrimary = scrolled || isWorkspace ? 'text-slate-900' : 'text-white';
  const textSecondary = scrolled || isWorkspace ? 'text-slate-400' : 'text-slate-300/70';
  const burgerBg = scrolled || isWorkspace ? 'bg-slate-900' : 'bg-white';

  return (
    <>
      <nav className={`fixed w-full top-0 left-0 z-[100] transition-all duration-500 ${navHeight} ${navBg}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          
          <Link to="/" className="z-[110] group outline-none" onClick={() => setIsOpen(false)}>
            <div className="flex flex-col leading-none">
              <div className={`text-xl md:text-2xl font-black tracking-tighter flex items-baseline uppercase transition-colors duration-500 ${textPrimary}`}>
                <span>DATA</span>
                <span className="text-indigo-500 font-extralight ml-1 tracking-widest text-sm md:text-lg">TECH</span>
              </div>
            </div>
          </Link>

          <button onClick={() => setIsOpen(true)} className="group flex items-center gap-4 cursor-pointer z-[110] bg-transparent border-none">
            <span className={`hidden md:block text-[10px] font-black tracking-[0.5em] uppercase ${textSecondary} group-hover:text-indigo-500 transition-colors`}>Menu</span>
            <div className="flex flex-col gap-1">
              <div className={`w-6 h-[2px] transition-all ${burgerBg}`}></div>
              <div className={`w-4 h-[2px] transition-all ${burgerBg}`}></div>
            </div>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[150] bg-[#02040a] flex flex-col overflow-hidden"
          >
            {/* Header inside overlay */}
            <div className="h-24 px-6 flex justify-between items-center max-w-7xl mx-auto w-full">
               <div className="text-[9px] font-black tracking-[0.5em] text-slate-700 uppercase">System Navigation</div>
               <button onClick={() => setIsOpen(false)} className="bg-transparent border-none text-white flex items-center gap-3">
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500">Close</span>
                  <X size={24} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-10">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 flex flex-col space-y-6">
                  {navLinks.map((link, i) => (
                    <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)} className="group block">
                       <span className={`text-4xl md:text-6xl font-black uppercase tracking-tighter ${isActive(link.href) ? 'text-indigo-500' : 'text-white hover:text-indigo-500'} transition-colors`}>
                        {link.name}
                       </span>
                    </Link>
                  ))}
                </div>
                
                <div className="lg:col-span-4 lg:col-start-9 space-y-10">
                  <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800">
                    <p className="text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-6">User Access</p>
                    {token ? (
                      <div className="space-y-4">
                        {internalLinks.filter(l => !l.role || l.role === role).map(l => (
                          <Link key={l.name} to={l.href} onClick={() => setIsOpen(false)} className="block text-slate-300 font-bold hover:text-white uppercase text-sm">
                            {l.name}
                          </Link>
                        ))}
                        <button onClick={handleLogout} className="text-rose-500 font-black text-[10px] uppercase pt-4 bg-transparent border-none cursor-pointer">Sign Out</button>
                      </div>
                    ) : (
                      <Link to="/login" onClick={() => setIsOpen(false)} className="block p-5 bg-indigo-600 rounded-xl text-center text-white font-black uppercase text-xs">Sign In Terminal</Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
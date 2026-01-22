import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import HeroSection from "./Hero";
import AboutSection from "./About";
import FAQSection from "./Faq";
import TestimonialSection from "./Testimonial";
import Careers from "./Work";


export default function Home() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token && token !== "undefined" && token !== "null") {
        try {
          const res = await API.get("/auth/check");
          setRole(res.data.role);
        } catch (err) {
          localStorage.clear();
          setRole(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-white font-black text-[10px] tracking-[0.5em] text-slate-300 uppercase">Loading Environment...</div>;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <HeroSection role={role} />
      <AboutSection />
      <Careers />
      <FAQSection />
      <TestimonialSection />

      <footer className="py-12 border-t border-slate-100 text-center">
        <div className="flex justify-center gap-8 mb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Link to="/terms" className="hover:text-blue-600">Terms</Link>
            <Link to="/privacy" className="hover:text-blue-600">Privacy</Link>
            <Link to="/contact" className="hover:text-blue-600">Contact</Link>
        </div>
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
          &copy; 2026 DataTech Agency. Strategic Partner of FreelanceWave.
        </p>
      </footer>
    </div>
  );
}
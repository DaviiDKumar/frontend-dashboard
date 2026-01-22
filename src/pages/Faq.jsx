import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircle, HelpCircle } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`border-b border-slate-100 transition-all duration-500 ${isOpen ? 'pb-6' : 'pb-0'}`}>
      <button
        onClick={onClick}
        className="w-full py-8 flex items-center justify-between text-left group outline-none"
      >
        <span className={`text-lg md:text-xl font-black uppercase tracking-tighter transition-colors duration-300 ${isOpen ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'}`}>
          {question}
        </span>
        <div className={`shrink-0 ml-4 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-blue-600 border-blue-600 text-white rotate-180' : 'border-slate-200 text-slate-400'}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { 
      q: "Is this work different from FreelanceWave?", 
      a: "No. We are the official Jaipur hub for FreelanceWave. You get the same legitimate projects, but with the benefit of our specialized terminal, faster local support, and dedicated training centers." 
    },
    { 
      q: "How do I get paid?", 
      a: "All earnings are tracked in real-time on your agent dashboard. Payouts are processed every Saturday via UPI or direct Bank Transfer. There are no hidden fees or delays." 
    },
    { 
      q: "Can I work part-time?", 
      a: "Yes. Our system is designed for flexibility. You can choose 4-hour or 8-hour shifts that fit your schedule, making it perfect for students and professionals alike." 
    },
    { 
      q: "Is there a joining fee?", 
      a: "Absolutely not. Joining DataTech is free. We provide the platform, the training, and the leads. We only succeed when you successfully complete your tasks." 
    }
  ];

  return (
    <section className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 -right-64 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* LEFT: CONTENT & HELP CARD */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6"
              >
                <HelpCircle size={14} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">Information Terminal</span>
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9]">
                Common <br /> <span className="text-blue-600">Queries.</span>
              </h2>
            </div>

            <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden group cursor-default shadow-2xl shadow-blue-900/20">
              <div className="relative z-10">
                <MessageCircle className="text-blue-400 mb-6" size={32} />
                <h4 className="text-xl font-black uppercase tracking-tight mb-2">Still have questions?</h4>
                <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                  Our support agents are available 10 AM — 7 PM at our Jaipur Hub.
                </p>
                <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-500">
                  Talk to an Agent
                </button>
              </div>
              {/* Background Decor */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>

          {/* RIGHT: ACCORDION LIST */}
          <div className="lg:col-span-7">
            <div className="border-t border-slate-100">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openIndex === i}
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
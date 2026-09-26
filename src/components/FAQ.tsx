import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  {
    q: 'Do I get lifetime access to the courses?',
    a: 'Access is tied to the validity of your plan or course (e.g. 2–4 years for memberships). During that window you get every update, new module, and recording at no extra cost.',
  },
  {
    q: 'Are the courses beginner-friendly?',
    a: 'Yes. Tracks like DSA in C++ and Web Development start from absolute fundamentals and ramp up to advanced, interview-ready problem solving — so you can join at any level.',
  },
  {
    q: 'What is the Strike Membership?',
    a: 'A single investment that unlocks the entire catalog. Strike Plus includes all current courses; Strike Ultra adds every upcoming course too — one payment, learn across the whole platform.',
  },
  {
    q: 'Is there a free way to try Strike first?',
    a: 'Absolutely. Several full courses — including System Design and DSA in C++ — are free on YouTube, so you can experience the teaching style before enrolling in a paid track.',
  },
  {
    q: 'How do I redeem the developer grant?',
    a: "Look for the assistant in the corner and toggle System: Standard → Overclock. Unlocking the hidden “developer grant” applies the OVERCLOCK coupon and reveals exclusive pricing across eligible courses and memberships — while the countdown lasts.",
  },
  {
    q: 'Do certificates hold real value?',
    a: 'Certificates are verifiable and backed by industry-grade projects you actually build, so they signal genuine, job-ready competence rather than passive completion.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto empty-space-zone" id="faq">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h4 className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2">FAQ</h4>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Questions, answered
        </h2>
      </motion.div>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className={`rounded-2xl border bg-[#0a0a0c] overflow-hidden transition-colors duration-300 ${
                isOpen ? 'border-cyan-500/40' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-2xl"
                aria-expanded={isOpen}
              >
                <span className={`text-base sm:text-lg font-semibold transition-colors ${isOpen ? 'text-cyan-400' : 'text-white'}`}>
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border ${
                    isOpen ? 'border-cyan-400/50 text-cyan-400 bg-cyan-500/10' : 'border-white/15 text-gray-400'
                  }`}
                >
                  <Plus size={16} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 sm:px-6 pb-5 text-sm sm:text-base text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;

import { useOverclock } from '../context/OverclockContext';
import { motion } from 'framer-motion';
import { Radio, Bot, Hammer, Swords, UserCheck, BadgeCheck } from 'lucide-react';

const features = [
  { icon: Radio, title: 'Live Doubt Sessions', desc: 'Real-time doubt solving with mentors so you are never stuck for long.' },
  { icon: Bot, title: 'Gen AI-Integrated Learning', desc: 'An AI copilot woven into every course to explain, review, and unblock you.' },
  { icon: Hammer, title: 'Industry-Grade Projects', desc: 'Ship production-style projects that actually belong on your resume.' },
  { icon: Swords, title: 'CodeArena & Contests', desc: 'Sharpen skills with 1200K+ practice problems, quizzes, and rated contests.' },
  { icon: UserCheck, title: 'Mentorship & Resume Review', desc: 'Personal guidance and resume reviews from engineers who have been there.' },
  { icon: BadgeCheck, title: 'Certificates That Count', desc: 'Earn verifiable certificates that signal real, job-ready competence.' },
];

const WhyStrike = () => {
  const { isOverclocked } = useOverclock();

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto empty-space-zone" id="why-strike">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <h4 className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2">Why Strike</h4>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
          Built for engineers who ship
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Not just video lectures — a complete system to take you from fundamentals to production-ready.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
      >
        {features.map(({ icon: Icon, title, desc }) => (
          <motion.div
            key={title}
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90 } } }}
            whileHover={{ y: -6 }}
            className={`group relative flex flex-col gap-4 rounded-2xl border bg-[#0a0a0c] p-6 sm:p-7 transition-all duration-300 ${
              isOverclocked
                ? 'border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]'
                : 'border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]'
            }`}
          >
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Icon size={22} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default WhyStrike;

import { motion, useReducedMotion } from 'framer-motion';

// Mentors shown on the real strikes.in "Meet With Our Mentors" section.
// NOTE: we don't have licensed headshots, so avatars are initial-based
// placeholders (see README known-limitations). Names/titles are accurate.
const mentors = [
  {
    name: 'Rohit Negi',
    role: 'Founder & Lead Instructor',
    initials: 'RN',
    image: '/rohit_negi.jpg',
    blurb: 'Ex-Uber engineer and IIT Guwahati post-graduate (GATE-CSE 2020, AIR 202). Teaches DSA, System Design & core CS to lakhs of learners on Coder Army.',
    badges: ['Ex-Uber', 'IIT Graduate', '2 Cr+ Package'],
    ring: 'from-cyan-400 to-blue-600',
  },
  {
    name: 'Aditya Tandon',
    role: 'Co-Founder & Senior Instructor',
    initials: 'AT',
    image: '/aditya_tandon.jpg',
    blurb: 'Builds the Web Development, DevOps & GenAI tracks and mentors project cohorts from idea to deployment.',
    badges: ['Web Dev', 'DevOps', 'GenAI'],
    ring: 'from-fuchsia-400 to-purple-600',
  },
];

const Mentors = () => {
  const reduce = useReducedMotion();
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto empty-space-zone" id="mentors">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center text-4xl md:text-5xl font-extrabold text-white mb-14 tracking-tight"
      >
        Meet With Our Mentors
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {mentors.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="flex flex-col items-center text-center gap-4 rounded-2xl border border-white/10 bg-[#0a0a0c] p-8 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
          >
            <div className="relative">
              {/* Slow rotating conic glow behind the avatar — premium touch, paused for reduced-motion */}
              {!reduce && (
                <motion.div
                  aria-hidden="true"
                  className={`absolute -inset-1.5 rounded-full bg-gradient-to-br ${m.ring} opacity-40 blur-md`}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                />
              )}
              <div className={`relative p-[3px] rounded-full bg-gradient-to-br ${m.ring}`}>
                <div className="relative w-28 h-28 rounded-full bg-[#0d0d12] flex items-center justify-center text-3xl font-black text-white tracking-wide overflow-hidden">
                  <span className="absolute inset-0 flex items-center justify-center">{m.initials}</span>
                  {m.image && (
                    <img 
                      src={m.image} 
                      alt={`${m.name} - ${m.role}`} 
                      className="absolute inset-0 w-full h-full object-cover z-10" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">{m.name}</h3>
              <p className="text-cyan-400 text-sm font-semibold mt-1">{m.role}</p>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{m.blurb}</p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
              {m.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-200"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Mentors;

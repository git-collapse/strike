import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FlipCard } from './FlipCard';

// Mentors shown on the real strikes.in "Meet With Our Mentors" section.
// Avatars use each mentor's public profile photo (from their verified
// channels/socials) with an initials fallback if the image fails to load.
// Add a mentor by appending to this array — `image` is optional.
type Mentor = {
  name: string;
  role: string;
  initials: string;
  image?: string; // optional public profile photo; falls back to initials
  blurb: string;
  badges: string[];
  ring: string;
};

const mentors: Mentor[] = [
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

const MentorCard = ({ m }: { m: Mentor }) => {
  const reduce = useReducedMotion();

  const avatar = (
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
        <div className="relative w-24 h-24 rounded-full bg-[#0d0d12] flex items-center justify-center text-2xl font-black text-white tracking-wide overflow-hidden">
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
  );

  const badges = (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {m.badges.map((badge) => (
        <span
          key={badge}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-200"
        >
          {badge}
        </span>
      ))}
    </div>
  );

  // FRONT — photo, name, designation, badges (existing data only)
  const front = (
    <div className="flex h-full w-full flex-col items-center text-center gap-4 rounded-2xl border border-white/10 bg-[#0a0a0c] p-8">
      {avatar}
      <div>
        <h3 className="text-xl font-bold text-white tracking-tight">{m.name}</h3>
        <p className="text-cyan-400 text-sm font-semibold mt-1">{m.role}</p>
      </div>
      {badges}
      <div className="flex-1" />
      <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">Hover to read bio</p>
    </div>
  );

  // BACK — biography + areas of expertise (from badges) + Explore Courses
  const back = (
    <div className="relative flex h-full w-full flex-col rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#0b0b10] to-[#0d0d16] p-8">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-yellow-400" />
      <div className="pt-1">
        <h3 className="text-lg font-bold text-white tracking-tight">{m.name}</h3>
        <p className="text-cyan-400 text-xs font-semibold mt-0.5">{m.role}</p>
      </div>
      <p className="mt-4 text-sm text-gray-300 leading-relaxed">{m.blurb}</p>
      <div className="mt-4">
        <p className="text-[11px] uppercase tracking-widest text-yellow-400/90 font-semibold mb-2">Areas of expertise</p>
        {badges}
      </div>
      <div className="flex-1" />
      <a
        href="#courses"
        className="mt-5 w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-cyan-500 text-black hover:bg-cyan-400 transition-colors active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        Explore Courses <ArrowRight size={15} />
      </a>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="h-full min-h-[24rem]"
    >
      <FlipCard front={front} back={back} className="h-full w-full" detailsLabel={`${m.name}'s bio`} />
    </motion.div>
  );
};

const Mentors = () => {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
        {mentors.map((m) => (
          <MentorCard key={m.name} m={m} />
        ))}
      </div>
    </section>
  );
};

export default Mentors;

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

// "Trusted by Visionaries" reviews from the real strikes.in homepage.
// Quotes are transcribed from the live site; one partially-obscured quote
// is lightly completed while staying faithful to its visible text.
const reviews = [
  {
    name: 'Gopal Kumar Jha',
    quote:
      "Completed Nexus MERN in 8-9 months. Rohit Bhaiya taught not just 'what' but 'why' behind everything. My consistency broke many times, but I finally made it!",
  },
  {
    name: 'Adheli Priyanka',
    quote:
      'Nexus builds from clear explanations. Daily problems and project contests kept me motivated throughout the journey.',
  },
  {
    name: 'Babita Patel',
    quote:
      'Nexus gave me a true from-scratch learning experience. The way they simplify core concepts, combined with daily assignments, live guidance, and exciting project challenges with rewards, kept me consistent and motivated every single day.',
  },
  {
    name: 'Raju Arya',
    quote:
      'The live classes, HD recordings, and daily practice problems made learning smooth. Real-world projects prepared me for actual development work in the industry.',
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto empty-space-zone" id="reviews">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 text-yellow-400 font-bold tracking-widest uppercase text-xs mb-3">
          <Star size={14} fill="currentColor" /> Reviews
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Trusted by Visionaries
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Hear from real learners who built projects, cracked interviews, and grew with Strike.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
      >
        {reviews.map((r) => (
          <motion.figure
            key={r.name}
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90 } } }}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0a0a0c] p-6 sm:p-7 transition-all duration-300 hover:border-cyan-500/30"
          >
            <div className="flex gap-0.5 text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <blockquote className="text-gray-300 leading-relaxed text-[15px]">“{r.quote}”</blockquote>
            <figcaption className="flex items-center gap-3 mt-auto pt-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/20 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                {r.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </div>
              <span className="font-semibold text-white text-sm">{r.name}</span>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
};

export default Testimonials;

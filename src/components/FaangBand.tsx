import { motion } from 'framer-motion';

// "Get All Premium Questions Asked In FAANG Companies" band from strikes.in.
// The company marks are the official monochrome brand glyphs (from the CC0
// simple-icons set, stored in /public/logos) used referentially to name the
// companies whose interview questions the practice track covers — the same
// lineup the live strikes.in band shows, extended to a familiar big-tech set.
const logos = [
  { name: 'Google', src: '/logos/google.svg' },
  { name: 'Amazon', src: '/logos/amazon.svg' },
  { name: 'Apple', src: '/logos/apple.svg' },
  { name: 'Meta', src: '/logos/meta.svg' },
  { name: 'Netflix', src: '/logos/netflix.svg' },
  { name: 'Oracle', src: '/logos/oracle.svg' },
];

const FaangBand = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 empty-space-zone" id="faang" aria-label="Practice FAANG interview questions">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-12 leading-tight"
        >
          Get All <span className="text-cyan-400">Premium</span> Questions Asked In{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">FAANG</span>{' '}
          Companies
        </motion.h2>

        {/* Continuous logo marquee — pauses on hover, static when reduced motion.
            overflow-hidden + edge-fade mask keep it premium and prevent any
            horizontal page overflow. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="group relative mb-12 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
        >
          <ul className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-6">
            {[...logos, ...logos].map((logo, i) => {
              const clone = i >= logos.length;
              return (
                <li key={i} className="flex shrink-0 items-center px-8 sm:px-10" aria-hidden={clone}>
                  <img
                    src={logo.src}
                    alt={clone ? '' : logo.name}
                    loading="lazy"
                    draggable={false}
                    className="h-7 w-auto select-none opacity-55 grayscale transition-all duration-300 [filter:brightness(0)_invert(1)] hover:scale-110 hover:opacity-100 sm:h-8"
                  />
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <a
            href="https://strikes.in/practice"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.45)] focus:outline-none focus:ring-2 focus:ring-white"
          >
            Go Ahead
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FaangBand;

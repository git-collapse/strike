import { motion } from 'framer-motion';

// "Get All Premium Questions Asked In FAANG Companies" band from strikes.in.
// Company names are rendered as styled wordmarks (not official logo assets).
// Kept to the four companies verified from the live strikes.in band —
// Oracle, Google, Facebook, Amazon — rather than inventing an extended lineup.
const companies = [
  { name: 'Oracle', className: 'text-red-500' },
  { name: 'Google', className: 'text-white' },
  { name: 'Facebook', className: 'text-blue-500' },
  { name: 'amazon', className: 'text-orange-400' },
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

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 mb-12"
        >
          {companies.map((c) => (
            <motion.span
              key={c.name}
              variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}
              className={`text-2xl sm:text-3xl font-black tracking-tight ${c.className} opacity-80 hover:opacity-100 transition-opacity`}
            >
              {c.name}
            </motion.span>
          ))}
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

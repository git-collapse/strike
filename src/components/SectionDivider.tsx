import { motion, useReducedMotion } from 'framer-motion';

// A subtle developer-themed separator: a thin gradient hairline with an optional
// monospace "code comment" label at its center. Used sparingly to give the long
// scroll a sense of rhythm and reinforce the code-editor visual language without
// adding clutter. Reveals on scroll; static under reduced-motion.
const SectionDivider = ({ label }: { label?: string }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" aria-hidden="true">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scaleX: 0.6 }}
        whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex items-center gap-4 origin-center"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
        {label && (
          <span className="font-mono text-[11px] tracking-widest text-gray-600 whitespace-nowrap select-none">
            <span className="text-cyan-500/60">//</span> {label}
          </span>
        )}
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
      </motion.div>
    </div>
  );
};

export default SectionDivider;

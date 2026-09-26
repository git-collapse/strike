import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Brief "decrypting" scramble for the developer-grant price. Only the digits
// are randomised (comma separators are preserved), so the string keeps its
// width and there is zero layout shift while it settles. Honors reduced motion.
const ScrambleNumber = ({ value, prefix }: { value: number; prefix: string }) => {
  const target = value.toLocaleString('en-IN');
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplay(target);
      return;
    }

    const scramble = () => target.replace(/\d/g, () => String(Math.floor(Math.random() * 10)));
    let iterations = 0;
    const maxIterations = 12; // ~600ms at 50ms/frame

    setDisplay(scramble());
    const interval = setInterval(() => {
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setDisplay(target);
      } else {
        setDisplay(scramble());
      }
    }, 50);

    return () => clearInterval(interval);
  }, [target]);

  return <>{prefix}{display}</>;
};

export const PriceReveal = ({ normalPrice, overclockedPrice, isOverclocked, className, prefix = '₹' }: { normalPrice: number | undefined, overclockedPrice: number | undefined, isOverclocked: boolean, className?: string, prefix?: string }) => {
  const currentPrice = isOverclocked ? overclockedPrice : normalPrice;

  return (
    <div className={`relative flex flex-col justify-end overflow-hidden ${className || ''}`}>
      {/* Invisible placeholder to establish proper layout constraints */}
      <div className="invisible flex flex-col pointer-events-none" aria-hidden="true">
        {isOverclocked && (
          <div className="text-[10px] font-bold tracking-widest uppercase mb-1">
            Developer Grant
          </div>
        )}
        <div className="font-bold tabular-nums">
          {prefix}{(currentPrice || 0).toLocaleString('en-IN')}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {!isOverclocked ? (
          <motion.div
            key={`normal-${currentPrice}`}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-0 left-0 flex flex-col justify-end"
          >
            <div className="font-bold text-white tabular-nums">
              {prefix}{(normalPrice || 0).toLocaleString('en-IN')}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`overclocked-${currentPrice}`}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)', scale: 1.05 }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute bottom-0 left-0 flex flex-col justify-end"
          >
            <div className="text-[10px] sm:text-xs font-bold text-cyan-400 tracking-widest uppercase mb-1 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              Developer Grant
            </div>
            <div className="font-bold text-cyan-400 font-mono tabular-nums drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              <ScrambleNumber value={overclockedPrice || 0} prefix={prefix} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

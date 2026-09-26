import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useOverclock } from '../context/OverclockContext';
import { Zap } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

// Friendly one-liners the mascot cycles through on tap. Personality only — no
// pricing or urgency here; the sale funnel stays owned by the floating robot.
const MASCOT_LINES = [
  "Hey! I'm Volt ⚡",
  'Explore the courses below 👇',
  'Psst… check the assistant in the corner.',
  'Ready to level up?',
];

export const HeroMascot = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { isOverclocked } = useOverclock();
  const shouldReduceMotion = useReducedMotion();

  // Tap interaction: cycle a speech bubble that auto-dismisses. Touch-friendly
  // (the whole mascot is a button) and keyboard-accessible.
  const [bubble, setBubble] = useState<number | null>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  const handleTap = () => {
    setBubble((prev) => (prev === null ? 0 : (prev + 1) % MASCOT_LINES.length));
  };

  useEffect(() => {
    if (bubble === null) return;
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setBubble(null), 2800);
    return () => window.clearTimeout(hideTimer.current);
  }, [bubble]);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: shouldReduceMotion ? 0 : -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
      className="flex-1 w-full max-w-xl mx-auto lg:max-w-none lg:w-auto relative group mt-10 lg:mt-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mascot Image with floating animation. The subtle x drift + rotation
          read as an idle "glance", so the mascot feels alive without moving
          enough to distract or shift surrounding layout. */}
      <motion.div
        animate={shouldReduceMotion ? {} : {
          y: isOverclocked ? [0, -12, 0] : [0, -6, 0],
          x: [0, 2, -2, 0],
          rotate: [0, 0.6, -0.6, 0],
          scale: isOverclocked ? [1.02, 1.05, 1.02] : [1, 1.005, 1]
        }}
        transition={{ repeat: Infinity, duration: isOverclocked ? 4 : 6, ease: "easeInOut" }}
        className="relative z-20"
      >
        <motion.button
          type="button"
          onClick={handleTap}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.93, rotate: -2 }}
          aria-label="Say hi to the Strike mascot"
          className="relative block w-full rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          {/* Tap speech bubble (distinct from the Overclock tooltip) */}
          <AnimatePresence>
            {bubble !== null && (
              <motion.span
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
                className="absolute -top-3 left-2 sm:left-6 z-40 bg-white text-black text-sm font-bold px-4 py-2 rounded-2xl rounded-bl-sm shadow-[0_10px_25px_rgba(0,0,0,0.45)] pointer-events-none whitespace-nowrap"
              >
                {MASCOT_LINES[bubble]}
              </motion.span>
            )}
          </AnimatePresence>

          <img
            src="/robot_mascot.jpg"
            alt="Strike Retro-Futuristic Robot Mascot"
            className={twMerge(clsx(
              "w-full h-auto object-cover transition-all duration-700",
              isHovered ? "brightness-110" : "",
              isOverclocked ? "drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]" : ""
            ))}
            style={{
              maskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)'
            }}
          />

          {/* Periodic "scan" sweep — a soft cyan band drifts down the mascot on a
              long cycle, evoking a robot idle-scanning/blinking. Masked to the
              mascot silhouette and low-opacity so it stays subtle. */}
          {!shouldReduceMotion && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{
                maskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)'
              }}
            >
              <motion.div
                className="absolute left-0 w-full h-10 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent"
                animate={{ top: ['-15%', '115%'] }}
                transition={{ repeat: Infinity, duration: isOverclocked ? 3.5 : 5, ease: 'linear', repeatDelay: isOverclocked ? 1.5 : 3.5 }}
              />
            </div>
          )}
          
          {/* Ambient Tiny Particles / Technical Lines */}
          <AnimatePresence>
            {!shouldReduceMotion && (
              <>
                <motion.div
                  animate={{ y: [0, -20, 0], x: [0, 10, 0], opacity: [0, 0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, delay: 0.2 }}
                  className="absolute top-1/4 -left-4 w-1.5 h-1.5 bg-cyan-400 rounded-full blur-[1px]"
                />
                <motion.div
                  animate={{ y: [0, 15, 0], x: [0, -10, 0], opacity: [0, 0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                  className="absolute bottom-1/3 -right-3 w-2 h-2 bg-blue-500 rounded-full blur-[1px]"
                />
                <motion.div
                  animate={{ scaleY: [0, 1, 0], opacity: [0, 0.5, 0], originY: 1 }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1.5 }}
                  className="absolute top-1/2 -right-6 w-px h-16 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
                />
              </>
            )}
          </AnimatePresence>

        </motion.button>
      </motion.div>

      {/* Grant Unlocked Tooltip */}
      <AnimatePresence>
        {isOverclocked && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.9 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.9 }}
            className="absolute -top-6 right-0 bg-white/10 backdrop-blur-md border border-cyan-400/50 text-cyan-400 px-5 py-2.5 rounded-2xl rounded-br-sm font-bold text-sm shadow-[0_10px_25px_rgba(34,211,238,0.2)] z-30 pointer-events-none whitespace-nowrap flex items-center gap-2"
          >
            <Zap size={14} className="animate-pulse text-cyan-400" />
            Developer Grant Unlocked
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle background glow */}
      <div className={twMerge(clsx(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-cyan-500/20 blur-[60px] -z-10 rounded-full transition-all duration-700",
        isHovered ? "opacity-100 scale-105" : "opacity-50",
        isOverclocked ? "bg-cyan-400/30 scale-110" : ""
      ))}></div>
    </motion.div>
  );
};

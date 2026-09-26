import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useReducedMotion } from 'framer-motion';

const SNIPPETS = {
  default: [
    '// STRIKE SYSTEM',
    'const grant = unlockDeveloperMode();',
    '> scanning environment...',
    'grant.activate();'
  ],
  hero: [
    '> system.ready()',
    '> developer access available',
    'const course = await discoverGrant();'
  ],
  courses: [
    '> scanning courses...',
    '> grant candidates found',
    'discount = "15%";'
  ],
  membership: [
    '> membership.verify()',
    '> plan.access = "ACTIVE"',
    'grant.activate();'
  ],
  sale: [
    '> anomaly detected',
    '> developer grant available',
    '// STRIKE OVERCLOCK'
  ]
};

export const DeveloperBackground = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 40, stiffness: 100, mass: 1 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const [snippet, setSnippet] = useState(SNIPPETS.default);
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Check if it's a touch device
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      setIsDesktop(false);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    let rafId: number;
    let isThrottled = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (isThrottled) return;
      isThrottled = true;

      rafId = requestAnimationFrame(() => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        
        const target = e.target as HTMLElement;
        if (target) {
          // STRICT EMPTY SPACE CHECK: Only trigger on actual backgrounds
          const isBlankSpace = target.classList.contains('empty-space-zone') || 
                               target === document.body || 
                               target === document.documentElement;

          if (isBlankSpace) {
            setIsVisible(true);
            if (target.closest('#home')) setSnippet(SNIPPETS.hero);
            else if (target.closest('#courses')) setSnippet(SNIPPETS.courses);
            else if (target.closest('#memberships')) setSnippet(SNIPPETS.membership);
            else setSnippet(SNIPPETS.default);
          } else {
            // Disappear immediately if entering a content area
            setIsVisible(false);
          }
        }

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setIsVisible(false);
        }, 1500); // Disappear if cursor stops moving for 1.5s

        isThrottled = false;
      });
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [cursorX, cursorY]);

  if (!isDesktop) return null;

  if (shouldReduceMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-[0.03] select-none font-mono text-cyan-500/50">
        <div className="absolute top-1/4 left-[10%] whitespace-pre">
          {SNIPPETS.hero.join('\n')}
        </div>
        <div className="absolute top-2/3 right-[10%] whitespace-pre">
          {SNIPPETS.courses.join('\n')}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[40] select-none font-mono text-xs sm:text-sm text-slate-300/80 bg-black/40 backdrop-blur-md border border-cyan-500/20 p-3.5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.15)]"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '20px',
        translateY: '20px',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="whitespace-pre leading-relaxed flex flex-col gap-0.5">
        {snippet.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </motion.div>
  );
};

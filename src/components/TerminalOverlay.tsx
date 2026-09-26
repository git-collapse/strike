import { useState, useEffect, useCallback } from 'react';
import { useOverclock } from '../context/OverclockContext';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TerminalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const lines = [
  "> Connecting to STRIKE mainframe...",
  "> Authenticating developer access...",
  "> Access granted.",
  "> Developer grants located.",
  "> Recalibrating interface..."
];

const TerminalOverlay = ({ isOpen, onClose }: TerminalOverlayProps) => {
  const { activateOverclock } = useOverclock();
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const finishSequence = useCallback(() => {
    setIsCompleted(true);
    activateOverclock();
    setTimeout(() => {
      onClose();
    }, 400); 
  }, [activateOverclock, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setVisibleLines(0);
      setIsCompleted(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setVisibleLines(lines.length);
      finishSequence();
      return;
    }

    if (visibleLines < lines.length) {
      const timer = setTimeout(() => {
        setVisibleLines(prev => prev + 1);
      }, 400); // Fast 400ms per line
      return () => clearTimeout(timer);
    } else if (visibleLines === lines.length && !isCompleted) {
      const finishTimer = setTimeout(() => {
        finishSequence();
      }, 500);
      return () => clearTimeout(finishTimer);
    }
  }, [isOpen, visibleLines, isCompleted, finishSequence]);

  const handleSkip = () => {
    setVisibleLines(lines.length);
    finishSequence();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm"
            onClick={handleSkip}
          />

          {/* Terminal Drawer / Bottom Sheet */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full bg-[#050505] border-t border-cyan-500/50 z-[110] shadow-[0_-10px_50px_rgba(34,211,238,0.15)] pb-safe"
            role="dialog"
            aria-label="Terminal Activation"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 bg-[length:200%_auto] animate-gradient-x" />
            
            <div className="max-w-3xl mx-auto px-4 py-5 sm:px-6 h-[40vh] min-h-[300px] flex flex-col relative font-mono text-sm sm:text-base">
              
              {/* Header */}
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                <span className="text-gray-400 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                  <span className="ml-2 font-bold tracking-widest text-xs uppercase">Terminal</span>
                </span>
                <button 
                  onClick={handleSkip} 
                  className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-3 py-1 bg-white/5 hover:bg-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  Skip <X size={16} />
                </button>
              </div>

              {/* Output */}
              <div className="flex-grow overflow-y-auto">
                {lines.slice(0, visibleLines).map((line, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={twMerge(clsx(
                      "mb-3 font-semibold",
                      idx === lines.length - 1 ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "text-gray-300"
                    ))}
                  >
                    {line}
                  </motion.div>
                ))}
                
                {visibleLines < lines.length && (
                  <div className="flex items-center text-cyan-400 mt-2">
                    <span className="animate-pulse w-2 h-4 bg-cyan-400 block"></span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TerminalOverlay;

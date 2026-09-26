import { useState, useEffect } from 'react';
import { useOverclock } from '../context/OverclockContext';
import { Zap, X, Copy, Check, ChevronRight, TerminalSquare, Clock } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SaleDiscoveryProps {
  onTrigger: () => void;
}

// ============================================================================
// SALE CONFIGURATION
// To change the sale deadline, update this single fixed timestamp.
// Currently set to ~1 day 1 hour 30 mins from the initial implementation.
// ============================================================================
export const OFFER_END_TIMESTAMP = 1790533686279; 

const SaleDiscovery: React.FC<SaleDiscoveryProps> = ({ onTrigger }) => {
  const { isOverclocked, deactivateOverclock, activateOverclock } = useOverclock();
  const [isHovered, setIsHovered] = useState(false);
  const [isRobotHovered, setIsRobotHovered] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = OFFER_END_TIMESTAMP - now;
      
      if (remaining <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
      } else {
        setTimeLeft(remaining);
        setIsExpired(false);
      }
    };
    
    // Run immediately, then every second
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(totalSeconds / (3600 * 24)).toString().padStart(2, '0');
    const h = Math.floor((totalSeconds % (3600 * 24)) / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return { d, h, m, s };
  };

  const { d, h, m, s } = formatTime(timeLeft);

  const handleCopy = async () => {
    if (isExpired) return;
    try {
      await navigator.clipboard.writeText('OVERCLOCK');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleActivateGrant = () => {
    if (isExpired) return;
    if (!isOverclocked) {
      activateOverclock();
    }
    setIsOfferOpen(false);
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  const isRobotActivated = isOfferOpen || isOverclocked;

  return (
    <>
      {/* 1. The Offer Panel (Triggered by Robot) */}
      <AnimatePresence>
        {isOfferOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
              onClick={() => setIsOfferOpen(false)}
            />
            
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: '100%' }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full sm:max-w-[600px] bg-[#0a0a0c] border-t sm:border border-cyan-500/50 rounded-t-3xl sm:rounded-3xl shadow-[0_-10px_50px_rgba(34,211,238,0.2)] sm:shadow-[0_0_60px_rgba(34,211,238,0.2)] overflow-hidden pointer-events-auto z-10 pb-safe sm:pb-0"
              role="dialog"
              aria-modal="true"
            >
              <div className={twMerge(clsx(
                "absolute top-0 left-0 w-full h-1.5 bg-[length:200%_auto] animate-gradient-x",
                isExpired ? "bg-red-500" : "bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600"
              ))} />
              
              <div className="p-6 sm:p-8">
                <button 
                  onClick={() => setIsOfferOpen(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  aria-label="Close offer panel"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className={twMerge(clsx(
                    "flex items-center gap-2 font-mono text-xs font-bold tracking-widest mb-3 uppercase",
                    isExpired ? "text-red-400" : "text-cyan-400"
                  ))}>
                    {isExpired ? <X size={14} /> : <Zap size={14} className="animate-pulse" />}
                    {isExpired ? "Developer Grant Expired" : "Developer Grant Found"}
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 drop-shadow-md">
                    {isExpired ? "Offer Ended" : "Claim 15% OFF"}
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
                    {isExpired 
                      ? "This developer grant has officially expired and can no longer be deployed. Keep an eye out for future signals." 
                      : "You've successfully intercepted the hidden developer grant. Apply this code to unlock exclusive pricing on eligible Strike courses and memberships."}
                  </p>

                  <div className="w-full flex flex-col gap-6">
                    {/* Timer & Coupon Row */}
                    <div className="w-full bg-[#111] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 shadow-inner">
                      
                      {/* Timer */}
                      <div className="flex flex-col items-center sm:items-start">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Clock size={12} className={isExpired ? "text-red-400" : "text-cyan-400"} />
                          {isExpired ? "Status" : "Offer Ends In"}
                        </span>
                        
                        {isExpired ? (
                          <div className="text-red-400 font-mono text-xl font-bold tracking-widest">
                            00 : 00 : 00 : 00
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 sm:gap-3 text-white font-mono text-xl sm:text-2xl font-bold tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            <div className="flex flex-col items-center">
                              <span>{d}</span>
                              <span className="text-[9px] text-cyan-500 uppercase tracking-widest mt-0.5">Days</span>
                            </div>
                            <span className="text-gray-600 mb-4">:</span>
                            <div className="flex flex-col items-center">
                              <span>{h}</span>
                              <span className="text-[9px] text-cyan-500 uppercase tracking-widest mt-0.5">Hrs</span>
                            </div>
                            <span className="text-gray-600 mb-4">:</span>
                            <div className="flex flex-col items-center">
                              <span>{m}</span>
                              <span className="text-[9px] text-cyan-500 uppercase tracking-widest mt-0.5">Mins</span>
                            </div>
                            <span className="text-gray-600 mb-4">:</span>
                            <div className="flex flex-col items-center">
                              <span className="text-cyan-400 animate-pulse">{s}</span>
                              <span className="text-[9px] text-cyan-500 uppercase tracking-widest mt-0.5">Secs</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="hidden sm:block h-12 w-px bg-white/10 mx-2"></div>
                      <div className="sm:hidden w-full h-px bg-white/10 my-2"></div>

                      {/* Coupon */}
                      <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Coupon Code</span>
                        <div className="flex items-center gap-3">
                          <span className={twMerge(clsx(
                            "font-mono text-xl sm:text-2xl font-bold tracking-widest",
                            isExpired ? "text-gray-600 line-through" : "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                          ))}>
                            OVERCLOCK
                          </span>
                          {!isExpired && (
                            <button 
                              onClick={handleCopy}
                              className={twMerge(clsx(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 font-bold text-xs uppercase tracking-wider",
                                copied ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30"
                              ))}
                              title="Copy code"
                              aria-label="Copy coupon code"
                            >
                              {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <button 
                      onClick={handleActivateGrant}
                      disabled={isExpired}
                      className={twMerge(clsx(
                        "w-full py-4 sm:py-5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 focus:outline-none uppercase tracking-widest text-sm",
                        isExpired 
                          ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5" 
                          : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_25px_rgba(34,211,238,0.3)] hover:shadow-[0_0_35px_rgba(34,211,238,0.5)] focus:ring-2 focus:ring-white"
                      ))}
                    >
                      {isExpired 
                        ? "Grant Unavailable" 
                        : (isOverclocked ? "Explore Courses" : "Deploy Grant")} 
                      {!isExpired && <ChevronRight size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. The Small Floating Robot Mascot (Primary Entry Point) */}
      <div className="fixed right-6 bottom-24 md:top-1/3 md:bottom-auto md:right-8 z-[110] flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {(isRobotHovered || isOfferOpen) && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.9, x: 20 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.9, x: 20 }}
              className={twMerge(clsx(
                "px-4 py-2.5 rounded-2xl rounded-br-sm font-bold text-sm shadow-[0_10px_25px_rgba(0,0,0,0.5)] pointer-events-auto whitespace-nowrap hidden sm:block border",
                isOfferOpen 
                  ? "bg-cyan-950 text-cyan-400 border-cyan-500/50" 
                  : "bg-white text-black border-transparent"
              ))}
            >
              {isOfferOpen 
                ? "Offer Unlocked! 🎁" 
                : (isOverclocked ? "Grant Deployed! 🚀" : "Psst... I've got a surprise for you.")}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOfferOpen(true)}
          onMouseEnter={() => setIsRobotHovered(true)}
          onMouseLeave={() => setIsRobotHovered(false)}
          onFocus={() => setIsRobotHovered(true)}
          onBlur={() => setIsRobotHovered(false)}
          className="relative pointer-events-auto group focus:outline-none focus:ring-4 focus:ring-cyan-400 rounded-full"
          aria-label="Discover Developer Grant Sale"
        >
          {/* Ambient Glow */}
          <div className={twMerge(
            clsx(
              "absolute inset-0 blur-[15px] rounded-full scale-150 transition-transform duration-500",
              isRobotActivated
                ? "bg-cyan-400/50 scale-175 animate-pulse" 
                : "bg-cyan-500/30 group-hover:bg-cyan-400/40 group-hover:scale-175"
            )
          )} />
          
          {/* Robot Image Container */}
          <motion.div
            animate={shouldReduceMotion ? {} : { 
              y: isRobotActivated ? [0, -10, 0] : [0, -6, 0],
              scale: isRobotActivated ? [1.1, 1.15, 1.1] : 1
            }}
            transition={{ repeat: Infinity, duration: isRobotActivated ? 2 : 4, ease: "easeInOut" }}
            className={twMerge(
              clsx(
                "relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 transition-all duration-300 transform bg-black",
                isRobotActivated 
                  ? "border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.8)] scale-110" 
                  : "border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] group-active:scale-95"
              )
            )}
          >
            {isRobotActivated && <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay z-10 pointer-events-none" />}
            <img 
              src="/robot_mascot.jpg" 
              alt="Floating Assistant Robot"
              className={twMerge(clsx(
                "w-full h-full object-cover object-top transition-transform duration-500",
                isRobotActivated ? "scale-125 contrast-125" : "group-hover:scale-110"
              ))}
            />
          </motion.div>
          {isOverclocked && !isOfferOpen && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase z-20 pointer-events-none">
              Active
            </div>
          )}
        </button>
      </div>

      {/* 3. Floating System: Standard Trigger (Secondary Entry Point) */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
        <button
          onClick={() => {
            if (isOverclocked) {
              deactivateOverclock();
            } else if (isExpired) {
              setIsOfferOpen(true); // Show them it's expired
            } else {
              onTrigger(); // Open terminal sequence
            }
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          className={twMerge(
            clsx(
              "group flex items-center gap-2.5 bg-[#0a0a0c] border px-4 py-2.5 rounded-full transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black",
              isOverclocked 
                ? "border-green-500/50 hover:bg-[#111] hover:border-green-400 focus:ring-green-400" 
                : "border-white/10 hover:border-cyan-500/50 hover:bg-[#111] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] focus:ring-cyan-400"
            )
          )}
          aria-label={isOverclocked ? "Deactivate Overclock Mode" : "Activate Developer Mode"}
        >
          {isOverclocked ? (
            <>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              <span className="text-green-400 font-mono text-xs font-bold tracking-widest uppercase">
                System Overclocked
              </span>
              <X size={14} className="text-green-400 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
            </>
          ) : (
            <>
              <TerminalSquare size={14} className={clsx(
                "transition-colors duration-300",
                isHovered ? "text-cyan-400" : "text-gray-500"
              )} />
              <span className={clsx(
                "font-mono text-xs font-bold tracking-widest uppercase transition-colors duration-300",
                isHovered ? "text-cyan-400" : "text-gray-400"
              )}>
                {isHovered ? "System: Overclock?" : "System: Standard"}
              </span>
              {isHovered && (
                <div className="absolute inset-0 border border-cyan-400/20 rounded-full animate-ping pointer-events-none" />
              )}
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default SaleDiscovery;

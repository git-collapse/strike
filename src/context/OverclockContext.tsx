import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';

// ============================================================================
// OFFER CONFIGURATION
// The countdown is driven by this single fixed absolute timestamp, so it can
// never "reset" on refresh — every browser computes the same remaining time
// from the current wall clock. To change the deadline, edit this one value.
// ============================================================================
export const OFFER_END_TIMESTAMP = 1792348140000;

const STORAGE_KEY = 'strike_overclock_active';

interface OverclockContextType {
  /** Whether developer ("Overclock") pricing is currently applied across the UI. */
  isOverclocked: boolean;
  /** True once the offer deadline has passed. When true the grant is unredeemable. */
  isExpired: boolean;
  /** Milliseconds remaining until the offer ends (0 once expired). */
  timeLeft: number;
  /** Activates developer pricing. No-op if the offer has already expired. */
  activateOverclock: () => void;
  /** Reverts to standard pricing. */
  deactivateOverclock: () => void;
}

const OverclockContext = createContext<OverclockContextType | undefined>(undefined);

const computeRemaining = () => Math.max(0, OFFER_END_TIMESTAMP - Date.now());

export const OverclockProvider = ({ children }: { children: ReactNode }) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => computeRemaining());
  const [isExpired, setIsExpired] = useState<boolean>(() => computeRemaining() <= 0);

  // Rehydrate persisted activation, but clamp: never restore an active grant
  // once the offer has expired (expiry must make the offer non-redeemable).
  const [isOverclocked, setIsOverclocked] = useState<boolean>(() => {
    if (computeRemaining() <= 0) return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const isExpiredRef = useRef(isExpired);
  isExpiredRef.current = isExpired;

  // Single ticking source of truth for the countdown + expiry.
  useEffect(() => {
    const tick = () => {
      const remaining = computeRemaining();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setIsExpired(true);
        // Auto-revert to standard pricing the moment the offer lapses.
        setIsOverclocked(false);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keep the persisted flag in sync so the grant survives refreshes.
  useEffect(() => {
    try {
      if (isOverclocked) {
        localStorage.setItem(STORAGE_KEY, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* storage unavailable (private mode / blocked) — degrade gracefully */
    }
  }, [isOverclocked]);

  const activateOverclock = useCallback(() => {
    if (isExpiredRef.current) return; // expired grants cannot be redeemed
    setIsOverclocked(true);
  }, []);

  const deactivateOverclock = useCallback(() => {
    setIsOverclocked(false);
  }, []);

  return (
    <OverclockContext.Provider
      value={{ isOverclocked, isExpired, timeLeft, activateOverclock, deactivateOverclock }}
    >
      {children}
    </OverclockContext.Provider>
  );
};

export const useOverclock = () => {
  const context = useContext(OverclockContext);
  if (context === undefined) {
    throw new Error('useOverclock must be used within an OverclockProvider');
  }
  return context;
};

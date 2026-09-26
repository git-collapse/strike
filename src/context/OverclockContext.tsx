import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface OverclockContextType {
  isOverclocked: boolean;
  activateOverclock: () => void;
  deactivateOverclock: () => void;
}

const OverclockContext = createContext<OverclockContextType | undefined>(undefined);

export const OverclockProvider = ({ children }: { children: ReactNode }) => {
  const [isOverclocked, setIsOverclocked] = useState(false);

  const activateOverclock = () => setIsOverclocked(true);
  const deactivateOverclock = () => setIsOverclocked(false);

  return (
    <OverclockContext.Provider value={{ isOverclocked, activateOverclock, deactivateOverclock }}>
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

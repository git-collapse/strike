import { useState, useEffect, useRef } from 'react';

interface DecryptPriceProps {
  finalPrice: number;
  isActive: boolean;
}

const DecryptPrice = ({ finalPrice, isActive }: DecryptPriceProps) => {
  const [displayPrice, setDisplayPrice] = useState<string>('0000');
  const [hasDecrypted, setHasDecrypted] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion && isActive) {
      setDisplayPrice(finalPrice.toLocaleString('en-IN'));
      setHasDecrypted(true);
      return;
    }

    if (!isActive || hasDecrypted) return;

    let iterations = 0;
    const maxIterations = 20; // 20 * 50ms = 1000ms scramble
    
    // Create an intersection observer to only animate when in view
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasDecrypted) {
          const interval = setInterval(() => {
            if (iterations >= maxIterations) {
              clearInterval(interval);
              setDisplayPrice(finalPrice.toLocaleString('en-IN'));
              setHasDecrypted(true);
            } else {
              // Generate a random 4 digit number string for scramble
              const randomNum = Math.floor(1000 + Math.random() * 9000);
              setDisplayPrice(randomNum.toString());
              iterations++;
            }
          }, 50);
          
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isActive, finalPrice, hasDecrypted]);

  // Make sure to render final price if not active, or active but not yet animated
  return (
    <span ref={containerRef} className="tabular-nums inline-block min-w-[3ch]">
      {isActive ? displayPrice : finalPrice.toLocaleString('en-IN')}
    </span>
  );
};

export default DecryptPrice;

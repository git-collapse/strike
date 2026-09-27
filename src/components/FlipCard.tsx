import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { RotateCw, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

interface FlipCardProps {
  /** Front face content — brings its own card surface (bg / border / rounded). */
  front: ReactNode;
  /** Back face content — brings its own card surface. */
  back: ReactNode;
  /** Sizing classes for the outer wrapper (e.g. "h-full w-full min-h-[24rem]"). */
  className?: string;
  /** Accessible label for the flip toggle, e.g. "course details". */
  detailsLabel?: string;
}

/**
 * Reusable 3D flip card.
 *
 * Mechanics: the wrapper owns the `perspective`; an inner "flipper" carries
 * `transform-style: preserve-3d` and animates `rotateY` 0 -> 180. Each face uses
 * `backface-visibility: hidden`; the back is pre-rotated 180deg so its text reads
 * correctly once the flipper turns. The front stays in normal flow so it defines
 * the card's height — the back is an absolute overlay matching that box, so
 * flipping never changes height or pushes neighbouring cards.
 *
 * Interaction: flips on hover (mouse), on an explicit toggle button (touch), and
 * the toggle is keyboard-reachable (focus-visible reveals it on desktop). The
 * hidden face is marked `inert`, so its links/buttons are never focusable or
 * clickable while turned away. `prefers-reduced-motion` swaps the rotation for a
 * plain cross-fade.
 */
export function FlipCard({ front, back, className, detailsLabel = 'details' }: FlipCardProps) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [toggled, setToggled] = useState(false);
  const flipped = hovered || toggled;

  return (
    <div
      className={clsx('group relative [perspective:1600px]', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d] [will-change:transform]"
        initial={false}
        animate={reduce ? undefined : { rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* FRONT — in normal flow, so it establishes the card height. */}
        <div
          inert={flipped}
          className={clsx(
            'relative h-full w-full [backface-visibility:hidden] [transform:translateZ(0.1px)]',
            reduce && 'transition-opacity duration-300',
            reduce && (flipped ? 'opacity-0' : 'opacity-100')
          )}
        >
          {front}
        </div>

        {/* BACK — absolute overlay, pre-rotated so it faces the viewer after the flip. */}
        <div
          inert={!flipped}
          className={clsx(
            'absolute inset-0 h-full w-full [backface-visibility:hidden]',
            reduce ? 'transition-opacity duration-300' : '[transform:rotateY(180deg)]',
            reduce && (flipped ? 'opacity-100' : 'opacity-0')
          )}
        >
          {back}
        </div>
      </motion.div>

      {/* Flip toggle — touch + keyboard accessible. Invisible for mouse users until
          they hover the card or focus it; always visible on coarse (touch) pointers. */}
      <button
        type="button"
        onClick={() => setToggled((t) => !t)}
        aria-pressed={flipped}
        aria-label={flipped ? 'Show summary' : `Show ${detailsLabel}`}
        className={clsx(
          'absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full',
          'bg-black/60 backdrop-blur-md border border-white/15 text-cyan-300',
          'transition-opacity active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:opacity-100',
          'pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-coarse:opacity-100'
        )}
      >
        {flipped ? <RotateCcw size={15} /> : <RotateCw size={15} />}
      </button>
    </div>
  );
}

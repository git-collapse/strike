import { useState } from 'react';
import { useOverclock } from '../context/OverclockContext';
import { ExternalLink, BookOpen, X, Clock, Layers, GraduationCap } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { PriceReveal } from './PriceReveal';
import { FlipCard } from './FlipCard';

export interface CourseData {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  hours?: string;
  prerequisites?: string;
  modules?: string;
  originalPrice?: number;
  currentPrice?: number;
  discountPercentage?: string;
  grantPrice?: number;
  isUpcoming?: boolean;
  category: 'paid' | 'free' | 'upcoming';
  isYouTubeFree?: boolean;
  href: string;
  syllabus?: { title: string; modules?: number; }[];
}

const CATEGORY_META: Record<CourseData['category'], { label: string; cls: string }> = {
  paid: { label: 'Paid', cls: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25' },
  free: { label: 'Free', cls: 'text-green-300 bg-green-500/10 border-green-500/25' },
  upcoming: { label: 'Upcoming', cls: 'text-blue-300 bg-blue-500/10 border-blue-500/25' },
};

const CourseCard = ({ course }: { course: CourseData }) => {
  const { isOverclocked } = useOverclock();
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isEligibleForGrant = isOverclocked && (course.grantPrice !== undefined && course.grantPrice > 0);

  // Calculate a reliable discount percentage dynamically if missing
  const activeCurrentPrice = isEligibleForGrant ? course.grantPrice : course.currentPrice;
  const calculatedDiscount = (course.originalPrice && activeCurrentPrice && course.originalPrice > activeCurrentPrice)
    ? Math.round((1 - (activeCurrentPrice / course.originalPrice)) * 100) + '% OFF'
    : course.discountPercentage;

  const getFallbackImage = () => {
    const words = course.title.replace(/[^a-zA-Z0-9\s+]/g, '').split(' ');
    let acronym = words.slice(0, 3).map(w => w.substring(0, 3).toUpperCase()).join(' ');

    if (course.title.includes('Thunder')) acronym = 'THUNDER';
    else if (course.title.includes('DSA')) acronym = 'DSA';
    else if (course.title.includes('System Design') || course.title.includes('HLD')) acronym = 'SYS DESIGN';
    else if (course.title.includes('Web')) acronym = 'WEB DEV';
    else if (course.title.includes('DevOps')) acronym = 'DEVOPS';
    else if (course.title.includes('GenAI') || course.title.includes('Generative AI')) acronym = 'GEN AI';

    const hash = course.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hues = [210, 260, 340, 150, 30, 190];
    const hue = hues[hash % hues.length];
    const color = `hsl(${hue}, 80%, 60%)`;

    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
      <rect width="800" height="450" fill="#050505"/>
      <defs>
        <pattern id="grid-${course.id}" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${color}" stroke-width="1" stroke-opacity="0.1"/>
        </pattern>
        <linearGradient id="grad-${course.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.9"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#grad-${course.id})"/>
      <rect width="800" height="450" fill="url(#grid-${course.id})"/>
      <circle cx="400" cy="225" r="200" fill="${color}" opacity="0.1" filter="blur(60px)"/>
      <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="64" font-weight="900" fill="white" letter-spacing="2">${acronym}</text>
      <rect x="350" y="270" width="100" height="4" fill="${color}" rx="2"/>
      <text x="50%" y="310" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="16" font-weight="bold" fill="${color}" letter-spacing="4">STRIKE // ${course.id.toUpperCase()}</text>
    </svg>`;

    const base64 = btoa(unescape(encodeURIComponent(svgStr)));
    return `data:image/svg+xml;base64,${base64}`;
  };

  const imageSrc = course.thumbnail && !imgError ? course.thumbnail : getFallbackImage();

  // Strip an embedded descriptor so the back panel doesn't read "Duration: Validity: 2 Years".
  const stripLabel = (s?: string) => (s ?? '').replace(/^\s*(validity|duration|hours?|time)\s*:\s*/i, '').trim();

  // Prerequisite label. Prefer explicit data; else derive conservatively from the
  // level the course states about itself — no fabricated specifics.
  const prerequisite = course.prerequisites ?? (
    course.isUpcoming
      ? 'Announced soon'
      : /beginner|from scratch|zero to hero|from the basic|foundation|fundamental/i.test(`${course.title} ${course.description ?? ''}`)
        ? 'No prior experience needed'
        : 'Basic programming knowledge'
  );

  const surface = isOverclocked ? 'border border-cyan-500/30' : 'border border-white/10';
  const rootGlow = isOverclocked
    ? 'shadow-[0_0_20px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_35px_rgba(34,211,238,0.3)]'
    : 'group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]';

  const categoryChip = (
    <span className={twMerge(clsx(
      'text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border',
      CATEGORY_META[course.category].cls
    ))}>
      {CATEGORY_META[course.category].label}
    </span>
  );

  // ---- FRONT FACE: thumbnail + category + title + price + primary CTA ----
  const front = (
    <div className={clsx('flex flex-col h-full w-full rounded-2xl overflow-hidden bg-[#0a0a0c] transition-colors duration-500', surface)}>
      <a href={course.href} target="_blank" rel="noopener noreferrer" className="relative w-full aspect-[16/9] block overflow-hidden border-b border-white/5 bg-[#050505] shrink-0">
        <img src={imageSrc} alt={course.title} loading="lazy" onError={() => setImgError(true)} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {isOverclocked && <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay pointer-events-none" />}
        {course.isUpcoming && (
          <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md border border-blue-400 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest rounded shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            Upcoming
          </div>
        )}
      </a>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex flex-wrap gap-2 mb-3 min-h-[28px]">{categoryChip}</div>
        <a href={course.href} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors block">
          <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-2 leading-tight min-h-[3.5rem]" title={course.title}>
            {course.title}
          </h3>
        </a>

        <div className="flex-1" />

        <div className="mb-5">
          <div className="flex items-center gap-2 h-5 mb-1">
            {course.originalPrice && !course.isUpcoming && course.originalPrice !== activeCurrentPrice && (
              <>
                <span className="text-xs text-gray-500 line-through font-medium">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                {calculatedDiscount && (
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-1.5 py-0.5 rounded">{calculatedDiscount}</span>
                )}
              </>
            )}
          </div>
          <div className="flex items-center h-8">
            {course.isYouTubeFree ? (
              <span className="text-xl font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                FREE
              </span>
            ) : course.isUpcoming ? (
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">To Be Announced</span>
            ) : course.currentPrice === 0 ? (
              <span className="text-2xl font-bold text-green-400 uppercase tracking-widest">FREE</span>
            ) : (
              <PriceReveal normalPrice={course.currentPrice} overclockedPrice={course.grantPrice} isOverclocked={isOverclocked} className="text-2xl" />
            )}
          </div>
        </div>

        {course.isUpcoming ? (
          <a href={course.href} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shrink-0 bg-gray-800 text-gray-400 border border-white/5 hover:bg-gray-700 hover:text-white uppercase tracking-wider active:scale-[0.98] transition-all">
            Coming Soon <ExternalLink size={16} />
          </a>
        ) : course.isYouTubeFree ? (
          <a href={course.href} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shrink-0 active:scale-[0.98] transition-all bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            Watch Free <ExternalLink size={16} />
          </a>
        ) : (
          <a href={course.href} target="_blank" rel="noopener noreferrer" className={twMerge(clsx(
            'w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shrink-0 active:scale-[0.98] transition-all',
            isOverclocked ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white border border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 'bg-white text-black hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
          ))}>
            {isOverclocked ? 'Deploy Grant' : 'Enroll Now'} <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );

  // ---- BACK FACE: description + specs + syllabus + Explore CTA ----
  const back = (
    <div className={clsx('relative flex flex-col h-full w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#0b0b10] to-[#0d0d16] p-5 sm:p-6', surface)}>
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-yellow-400" />

      <div className="flex items-center gap-2 mb-3 pt-1 pr-10">
        {categoryChip}
        <h3 className="text-sm font-bold text-white line-clamp-1" title={course.title}>{course.title}</h3>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed line-clamp-4 mb-4">
        {course.description || 'A hands-on STRIKE program with structured modules, live guidance and real-world projects.'}
      </p>

      <div className="space-y-2.5 mb-4">
        <div className="flex items-center gap-2.5 text-xs text-gray-200">
          <Clock size={14} className="text-cyan-400 shrink-0" />
          <span className="font-semibold text-gray-400 w-24 shrink-0">Duration</span>
          <span className="truncate">{stripLabel(course.duration) || 'Self-paced'}</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-gray-200">
          <Layers size={14} className="text-cyan-400 shrink-0" />
          <span className="font-semibold text-gray-400 w-24 shrink-0">Learning hours</span>
          <span className="truncate">{stripLabel(course.hours) || 'Full course'}</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-gray-200">
          <GraduationCap size={14} className="text-yellow-400 shrink-0" />
          <span className="font-semibold text-gray-400 w-24 shrink-0">Prerequisites</span>
          <span className="truncate">{prerequisite}</span>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex flex-col gap-2">
        {course.syllabus && course.syllabus.length > 0 && (
          <button onClick={() => setShowSyllabus(true)} className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10 text-gray-200 hover:bg-white/5 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            <BookOpen size={14} /> View Syllabus
          </button>
        )}
        <a href={course.href} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-cyan-500 text-black hover:bg-cyan-400 transition-colors active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
          Explore Course <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );

  return (
    <>
      <FlipCard
        className={clsx('h-full w-full rounded-2xl transition-shadow duration-500', rootGlow)}
        detailsLabel="course details"
        front={front}
        back={back}
      />

      <AnimatePresence>
        {showSyllabus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSyllabus(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl border border-cyan-500/25 bg-[#0a0a0c] p-6 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
            >
              <button
                onClick={() => setShowSyllabus(false)}
                aria-label="Close syllabus"
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <X size={16} />
              </button>
              <h4 className="text-lg font-bold text-white mb-1 pr-8">{course.title}</h4>
              <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-4">Syllabus</p>
              <ol className="space-y-2">
                {course.syllabus?.map((mod, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-bold">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-100 font-medium leading-snug">{mod.title}</p>
                      {mod.modules !== undefined && (
                        <p className="text-[11px] text-gray-500 mt-0.5">{mod.modules} modules</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CourseCard;

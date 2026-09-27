import { useState } from 'react';
import { useOverclock } from '../context/OverclockContext';
import { ExternalLink, ArrowRight, Info, GraduationCap, PlayCircle } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { PriceReveal } from './PriceReveal';
import { MENTORS, type CourseData, type CourseLevel } from '../data/courses';

// Re-exported so existing imports (`import type { CourseData } from './CourseCard'`)
// keep working now that the catalog + types live in ../data/courses.
export type { CourseData } from '../data/courses';

const CATEGORY_META: Record<CourseData['category'], { label: string; cls: string }> = {
  paid: { label: 'Paid', cls: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25' },
  free: { label: 'Free', cls: 'text-green-300 bg-green-500/10 border-green-500/25' },
  upcoming: { label: 'Upcoming', cls: 'text-blue-300 bg-blue-500/10 border-blue-500/25' },
};

const LEVEL_META: Record<CourseLevel, string> = {
  Beginner: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
  Intermediate: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
  Advanced: 'text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/25',
  'All Levels': 'text-sky-300 bg-sky-500/10 border-sky-500/25',
};

// Deterministic branded SVG placeholder — used when a thumbnail is missing or
// fails to load, so every card always renders a polished, on-theme image.
export const getFallbackImage = (course: Pick<CourseData, 'id' | 'title'>) => {
  const words = course.title.replace(/[^a-zA-Z0-9\s+]/g, '').split(' ');
  let acronym = words.slice(0, 3).map((w) => w.substring(0, 3).toUpperCase()).join(' ');
  if (course.title.includes('Thunder')) acronym = 'THUNDER';
  else if (course.title.includes('DSA') || course.title.includes('Data Structures')) acronym = 'DSA';
  else if (course.title.includes('System Design') || course.title.includes('HLD')) acronym = 'SYS DESIGN';
  else if (course.title.includes('Web')) acronym = 'WEB DEV';
  else if (course.title.includes('DevOps')) acronym = 'DEVOPS';
  else if (course.title.includes('GenAI') || course.title.includes('Generative AI')) acronym = 'GEN AI';
  else if (course.title.includes('Blockchain')) acronym = 'BLOCKCHAIN';

  const hash = course.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hues = [210, 260, 340, 150, 30, 190];
  const hue = hues[hash % hues.length];
  const color = `hsl(${hue}, 80%, 60%)`;
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="#050505"/><defs><linearGradient id="g-${course.id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${color}" stop-opacity="0.18"/><stop offset="100%" stop-color="#000" stop-opacity="0.9"/></linearGradient></defs><rect width="800" height="450" fill="url(#g-${course.id})"/><circle cx="400" cy="225" r="200" fill="${color}" opacity="0.1"/><text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="60" font-weight="900" fill="white" letter-spacing="2">${acronym}</text><text x="50%" y="62%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="15" font-weight="bold" fill="${color}" letter-spacing="4">STRIKE</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgStr)))}`;
};
const MentorRow = ({ mentorKey }: { mentorKey: string }) => {
  const mentor = MENTORS[mentorKey];
  if (!mentor) return null;
  const [imgError, setImgError] = useState(false);
  return (
    <div className="flex items-center gap-2.5">
      {mentor.image && !imgError ? (
        <img
          src={mentor.image}
          alt={mentor.name}
          onError={() => setImgError(true)}
          className="h-8 w-8 rounded-full object-cover ring-1 ring-white/15"
        />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-[11px] font-bold text-cyan-300 ring-1 ring-cyan-400/25">
          {mentor.initials}
        </span>
      )}
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[13px] font-semibold text-white">{mentor.name}</p>
        <p className="truncate text-[11px] text-gray-500">{mentor.role}</p>
      </div>
    </div>
  );
};

interface CourseCardProps {
  course: CourseData;
  onViewDetails?: (course: CourseData) => void;
}

const CourseCard = ({ course, onViewDetails }: CourseCardProps) => {
  const { isOverclocked } = useOverclock();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const imageSrc = course.thumbnail && !imgError ? course.thumbnail : getFallbackImage(course);
  const cat = CATEGORY_META[course.category];
  // Upcoming courses use currentPrice: 0 as a placeholder (price not set yet),
  // so they must never read as "Free" — they show "Coming Soon" instead.
  const isFree = !course.isUpcoming && (course.isYouTubeFree || course.currentPrice === 0);
  const discountPct =
    course.originalPrice && course.currentPrice && course.originalPrice > course.currentPrice
      ? Math.round((1 - course.currentPrice / course.originalPrice) * 100)
      : null;

  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0f] transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.12)]">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#111]">
        {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.06] to-transparent" />}
        <img
          src={imageSrc}
          alt={course.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
          className={clsx(
            'h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.04]',
            imgLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0f] via-transparent to-transparent" />

        {/* Category badge (top-left) */}
        <span className={twMerge(clsx('absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm', cat.cls))}>
          {cat.label}
        </span>

        {/* Level badge (top-right) */}
        {course.level && (
          <span className={twMerge(clsx('absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm', LEVEL_META[course.level]))}>
            {course.level}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {course.tags.map((t) => (
              <span key={t} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-gray-400 ring-1 ring-white/10">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-white transition-colors group-hover:text-cyan-100">
          {course.title}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">{course.description}</p>
        )}

        {/* Mentor */}
        {course.mentor && <MentorRow mentorKey={course.mentor} />}

        {/* Meta specs */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500">
          {course.duration && <span className="inline-flex items-center gap-1"><GraduationCap size={13} className="text-gray-600" />{course.duration}</span>}
          {course.hours && <span>{course.hours}</span>}
        </div>

        {/* Price */}
        <div className="mt-auto pt-2">
          {isFree ? (
            <span className="text-xl font-extrabold text-green-400">Free</span>
          ) : course.isUpcoming ? (
            <span className="text-sm font-bold uppercase tracking-wider text-blue-300">Coming Soon</span>
          ) : (
            <div className="flex items-end gap-2.5">
              <PriceReveal
                normalPrice={course.currentPrice}
                overclockedPrice={course.grantPrice}
                isOverclocked={isOverclocked}
                className="text-2xl"
              />
              {!isOverclocked && course.originalPrice && course.originalPrice !== course.currentPrice && (
                <span className="pb-0.5 text-sm text-gray-500 line-through">
                  ₹{course.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {!isOverclocked && discountPct && (
                <span className="mb-0.5 rounded-md bg-green-500/15 px-1.5 py-0.5 text-[11px] font-bold text-green-300 ring-1 ring-green-500/25">
                  {discountPct}% OFF
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3">
          <button
            type="button"
            onClick={() => onViewDetails?.(course)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm font-semibold text-gray-200 transition-colors hover:border-white/20 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <Info size={15} /> Details
          </button>
          <motion.a
            href={course.href}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.97 }}
            className={twMerge(clsx(
              'inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-bold text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300',
              isFree
                ? 'bg-gradient-to-r from-red-500/90 to-rose-600/90 hover:shadow-[0_0_18px_rgba(244,63,94,0.35)]'
                : course.isUpcoming
                  ? 'bg-white/10 hover:bg-white/15'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_18px_rgba(6,182,212,0.4)]'
            ))}
          >
            {course.isYouTubeFree ? (<><PlayCircle size={15} /> Watch Free</>)
              : course.isUpcoming ? (<>Notify Me <ArrowRight size={15} /></>)
              : (<>Enroll Now <ExternalLink size={14} /></>)}
          </motion.a>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;

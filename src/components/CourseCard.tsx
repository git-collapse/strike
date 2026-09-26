import { useState } from 'react';
import { useOverclock } from '../context/OverclockContext';
import { ExternalLink, BookOpen, X } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { PriceReveal } from './PriceReveal';

export interface CourseData {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  hours?: string;
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

  return (
    <>
      <div className={twMerge(
        clsx(
          "flex flex-col bg-[#0a0a0c] rounded-2xl overflow-hidden transition-all duration-500 transform h-full w-full relative",
          "hover:-translate-y-2 group",
          isOverclocked 
            ? "border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_35px_rgba(34,211,238,0.3)] hover:border-cyan-400" 
            : "border border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
        )
      )}>
        {/* THUMBNAIL (Fixed 16:9) */}
        <a href={course.href} target="_blank" rel="noopener noreferrer" className="relative w-full aspect-[16/9] block overflow-hidden border-b border-white/5 bg-[#050505] shrink-0">
          <img 
            src={imageSrc} 
            alt={course.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Overclock Inner Glow */}
          {isOverclocked && (
            <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay pointer-events-none" />
          )}
          {course.isUpcoming && (
            <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md border border-blue-400 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest rounded shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              Upcoming
            </div>
          )}
        </a>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 p-5 sm:p-6 relative z-10">
          <a href={course.href} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors block mb-3 group-hover:text-cyan-50">
            <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-2 leading-tight min-h-[3.5rem]" title={course.title}>
              {course.title}
            </h3>
          </a>
          
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4 min-h-[2.5rem]" title={course.description}>
            {course.description}
          </p>

          {/* META TAGS */}
          <div className="flex flex-wrap gap-2 mb-5 min-h-[28px]">
            {course.duration && (
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-1 rounded">
                {course.duration}
              </span>
            )}
            {course.hours && (
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-1 rounded">
                {course.hours}
              </span>
            )}
          </div>
          
          <div className="flex-1"></div>

          {course.syllabus && course.syllabus.length > 0 && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                setShowSyllabus(true);
              }}
              className="text-cyan-500 text-xs font-semibold flex items-center gap-1.5 hover:text-cyan-400 transition-colors mb-5 w-fit"
            >
              <BookOpen size={14} /> View Syllabus
            </button>
          )}
          
          {/* PRICING BLOCK */}
          <div className="mt-auto mb-5 relative">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 h-5 mb-1">
                <AnimatePresence mode="popLayout">
                  {course.originalPrice && !course.isUpcoming && course.originalPrice !== activeCurrentPrice && (
                    <motion.div
                      key="discount-meta"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xs text-gray-500 line-through font-medium">
                        ₹{course.originalPrice.toLocaleString('en-IN')}
                      </span>
                      {calculatedDiscount && (
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-1.5 py-0.5 rounded">
                          {calculatedDiscount}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex items-center h-8">
                {course.isYouTubeFree ? (
                  <span className="text-xl font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    FREE ON YOUTUBE
                  </span>
                ) : course.isUpcoming ? (
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    To Be Announced
                  </span>
                ) : course.currentPrice === 0 ? (
                  <span className="text-2xl font-bold text-green-400 uppercase tracking-widest">
                    FREE
                  </span>
                ) : (
                  <PriceReveal 
                    normalPrice={course.currentPrice} 
                    overclockedPrice={course.grantPrice} 
                    isOverclocked={isOverclocked} 
                    className="text-2xl"
                  />
                )}
              </div>
            </div>
          </div>

          {/* CTA BUTTON */}
          {course.isUpcoming ? (
            <a 
              href={course.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shrink-0 bg-gray-800 text-gray-400 border border-white/5 hover:bg-gray-700 hover:text-white uppercase tracking-wider"
            >
              Coming Soon <ExternalLink size={16} />
            </a>
          ) : course.isYouTubeFree ? (
            <a 
              href={course.href}
              target="_blank"
              rel="noopener noreferrer"
              className={twMerge(
                clsx(
                  "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shrink-0",
                  "bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                )
              )}
            >
              Watch Free Course <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          ) : (
            <a 
              href={course.href}
              target="_blank"
              rel="noopener noreferrer"
              className={twMerge(
                clsx(
                  "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shrink-0",
                  isOverclocked 
                    ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white border border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]" 
                    : "bg-white text-black hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                )
              )}
            >
              {isOverclocked ? "Deploy Grant" : "Enroll Now"} <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* SYLLABUS MODAL */}
      <AnimatePresence>
        {showSyllabus && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#08080a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />
              
              <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
                <h3 className="text-xl font-bold text-white pr-4">{course.title} Syllabus</h3>
                <button 
                  onClick={() => setShowSyllabus(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="Close syllabus"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="space-y-3">
                  {course.syllabus?.map((phase, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                      <h4 className="text-white font-semibold text-sm mb-1">{phase.title}</h4>
                      {phase.modules && (
                        <p className="text-cyan-400 text-xs font-mono">{phase.modules} Modules</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border-t border-white/10 bg-black/50 shrink-0">
                <a 
                  href={course.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  View Full Details on Strike <ExternalLink size={16} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CourseCard;

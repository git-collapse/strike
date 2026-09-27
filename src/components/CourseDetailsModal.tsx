import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ExternalLink, PlayCircle, ArrowRight, GraduationCap, CheckCircle2, ListChecks, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useOverclock } from '../context/OverclockContext';
import { PriceReveal } from './PriceReveal';
import { getFallbackImage } from './CourseCard';
import { MENTORS, relatedCourses, type CourseData } from '../data/courses';

interface CourseDetailsModalProps {
  course: CourseData | null;
  onClose: () => void;
  onSelectCourse: (course: CourseData) => void;
}

const CourseDetailsModal = ({ course, onClose, onSelectCourse }: CourseDetailsModalProps) => {
  const reduce = useReducedMotion();
  const { isOverclocked } = useOverclock();
  const [imgError, setImgError] = useState(false);
  const [showAllModules, setShowAllModules] = useState(false);

  // Reset transient UI whenever a different course is opened.
  useEffect(() => {
    setImgError(false);
    setShowAllModules(false);
  }, [course?.id]);

  // Esc to close + body scroll-lock while open.
  useEffect(() => {
    if (!course) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [course, onClose]);

  return (
    <AnimatePresence>
      {course && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:p-6 md:items-center"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${course.title} details`}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0f] shadow-2xl"
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* Header image */}
            <div className="relative aspect-video w-full overflow-hidden bg-[#111]">
              <img
                src={course.thumbnail && !imgError ? course.thumbnail : getFallbackImage(course)}
                alt={course.title}
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/40 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-gray-200 backdrop-blur transition-colors hover:bg-black/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
                {course.tags?.map((t) => (
                  <span key={t} className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-gray-200 backdrop-blur ring-1 ring-white/15">{t}</span>
                ))}
              </div>
            </div>
            {(() => {
              const mentor = course.mentor ? MENTORS[course.mentor] : undefined;
              const related = relatedCourses(course);
              // Upcoming courses carry currentPrice: 0 as a placeholder, so
              // they must show "Coming Soon" rather than reading as free.
              const isFree = !course.isUpcoming && (course.isYouTubeFree || course.currentPrice === 0);
              const modules = course.syllabus ?? [];
              const visibleModules = showAllModules ? modules : modules.slice(0, 5);
              return (
                <div className="max-h-[68vh] overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
                  <div className="flex flex-wrap items-center gap-2">
                    {course.level && (
                      <span className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-300">{course.level}</span>
                    )}
                    {course.duration && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500"><GraduationCap size={13} />{course.duration}</span>
                    )}
                    {course.hours && <span className="text-xs text-gray-500">{course.hours}</span>}
                  </div>

                  <h2 className="mt-2 text-2xl font-extrabold leading-tight text-white sm:text-3xl">{course.title}</h2>

                  {/* Mentor */}
                  {mentor && (
                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-bold text-cyan-300 ring-1 ring-cyan-400/25">{mentor.initials}</span>
                      <div className="leading-tight">
                        <p className="text-sm font-semibold text-white">{mentor.name}</p>
                        <p className="text-xs text-gray-500">{mentor.role}</p>
                      </div>
                    </div>
                  )}

                  {/* Overview */}
                  {course.description && (
                    <section className="mt-6">
                      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-400">Overview</h3>
                      <p className="text-sm leading-relaxed text-gray-300">{course.description}</p>
                    </section>
                  )}

                  {/* Topics covered */}
                  {course.tags && course.tags.length > 0 && (
                    <section className="mt-6">
                      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-400">Topics Covered</h3>
                      <div className="flex flex-wrap gap-2">
                        {course.tags.map((t) => (
                          <span key={t} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06] px-3 py-1.5 text-xs font-medium text-cyan-200">
                            <CheckCircle2 size={13} /> {t}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}
                  {/* Curriculum */}
                  {modules.length > 0 && (
                    <section className="mt-6">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400">
                        <ListChecks size={15} /> Curriculum
                      </h3>
                      <ol className="space-y-2">
                        {visibleModules.map((m, i) => (
                          <li key={i} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cyan-500/15 text-[11px] font-bold text-cyan-300">{i + 1}</span>
                            <div className="min-w-0">
                              <p className="text-sm text-gray-200">{m.title}</p>
                              {m.modules && <p className="text-[11px] text-gray-500">{m.modules} modules</p>}
                            </div>
                          </li>
                        ))}
                      </ol>
                      {modules.length > 5 && (
                        <button
                          type="button"
                          onClick={() => setShowAllModules((v) => !v)}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 transition-colors hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                        >
                          {showAllModules ? 'Show less' : `Show all ${modules.length} modules`}
                          <ChevronDown size={14} className={clsx('transition-transform', showAllModules && 'rotate-180')} />
                        </button>
                      )}
                    </section>
                  )}

                  {/* Prerequisites — only when the course actually states them. */}
                  {course.prerequisites && (
                    <section className="mt-6">
                      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-400">Prerequisites</h3>
                      <p className="text-sm leading-relaxed text-gray-300">{course.prerequisites}</p>
                    </section>
                  )}

                  {/* Pricing + enrollment CTA */}
                  <section className="mt-7 flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      {isFree ? (
                        <span className="text-2xl font-extrabold text-green-400">Free</span>
                      ) : course.isUpcoming ? (
                        <span className="text-lg font-bold uppercase tracking-wider text-blue-300">Coming Soon</span>
                      ) : (
                        <div className="flex items-end gap-2.5">
                          <PriceReveal normalPrice={course.currentPrice} overclockedPrice={course.grantPrice} isOverclocked={isOverclocked} className="text-3xl" />
                          {!isOverclocked && course.originalPrice && course.originalPrice !== course.currentPrice && (
                            <span className="pb-1 text-sm text-gray-500 line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <a
                      href={course.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={twMerge(clsx(
                        'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300',
                        isFree
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-[0_0_22px_rgba(244,63,94,0.4)]'
                          : course.isUpcoming
                            ? 'bg-white/10 hover:bg-white/15'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_22px_rgba(6,182,212,0.45)]'
                      ))}
                    >
                      {course.isYouTubeFree ? (<><PlayCircle size={16} /> Watch Free</>)
                        : course.isUpcoming ? (<>Notify Me <ArrowRight size={16} /></>)
                        : (<>Enroll Now <ExternalLink size={15} /></>)}
                    </a>
                  </section>

                  {/* Related courses */}
                  {related.length > 0 && (
                    <section className="mt-7">
                      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">Related Courses</h3>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {related.map((rc) => (
                          <button
                            key={rc.id}
                            type="button"
                            onClick={() => onSelectCourse(rc)}
                            className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-left transition-colors hover:border-cyan-500/40 hover:bg-cyan-500/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                          >
                            <img
                              src={rc.thumbnail || getFallbackImage(rc)}
                              alt={rc.title}
                              className="h-12 w-20 shrink-0 rounded-lg object-cover"
                            />
                            <span className="min-w-0">
                              <span className="line-clamp-2 text-xs font-semibold text-gray-200 group-hover:text-cyan-100">{rc.title}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              );
            })()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CourseDetailsModal;

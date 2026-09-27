import { useState, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Search, X, SlidersHorizontal, BookOpen, Layers, Gift } from 'lucide-react';
import CourseCard from './CourseCard';
import CourseDetailsModal from './CourseDetailsModal';
import { allCourses, availableTopics, MENTORS, type CourseData, type CourseTopic } from '../data/courses';

type StatusTab = 'all' | 'paid' | 'free' | 'upcoming';
type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

const STATUS_TABS: { id: StatusTab; label: string }[] = [
  { id: 'all', label: 'All Courses' },
  { id: 'paid', label: 'Paid' },
  { id: 'free', label: 'Free' },
  { id: 'upcoming', label: 'Upcoming' },
];

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'name', label: 'Name: A–Z' },
];

// Effective price used only for sorting (free / upcoming sort as 0).
const priceOf = (c: CourseData) => c.currentPrice ?? c.originalPrice ?? 0;

const CourseGrid = () => {
  const [status, setStatus] = useState<StatusTab>('all');
  const [topics, setTopics] = useState<Set<CourseTopic>>(new Set());
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');
  const [selected, setSelected] = useState<CourseData | null>(null);

  const visible = useMemo(() => allCourses.filter((c) => !c.hidden), []);
  const topicOptions = useMemo(() => availableTopics(visible), [visible]);
  const featured = useMemo(() => visible.find((c) => c.featured), [visible]);

  // Real, non-fabricated catalog stats.
  const stats = useMemo(() => ({
    total: visible.length,
    free: visible.filter((c) => c.category === 'free').length,
    tracks: topicOptions.length,
  }), [visible, topicOptions]);

  const toggleTopic = (t: CourseTopic) => {
    setTopics((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const clearAll = () => { setStatus('all'); setTopics(new Set()); setQuery(''); setSort('featured'); };

  const isDefaultView = status === 'all' && topics.size === 0 && query.trim() === '' && sort === 'featured';
  const hasActiveFilters = status !== 'all' || topics.size > 0 || query.trim() !== '' || sort !== 'featured';

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = visible.filter((c) => {
      if (status !== 'all' && c.category !== status) return false;
      if (topics.size > 0 && !(c.tags ?? []).some((t) => topics.has(t))) return false;
      if (q) {
        const mentorName = c.mentor ? MENTORS[c.mentor]?.name ?? '' : '';
        const haystack = [c.title, c.description ?? '', mentorName, ...(c.tags ?? [])].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => priceOf(a) - priceOf(b));
    else if (sort === 'price-desc') list = [...list].sort((a, b) => priceOf(b) - priceOf(a));
    else if (sort === 'name') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [visible, status, topics, query, sort]);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black min-h-screen scroll-mt-24 empty-space-zone" id="courses">
      {/* ===== Hero header ===== */}
      <div className="mb-10 text-center md:text-left empty-space-zone">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400/80">Strike Learning Platform</p>
        <h2 className="mt-2 text-3xl md:text-5xl font-extrabold text-white tracking-tight">Master in-demand skills</h2>
        <p className="mt-3 text-gray-400 text-base md:text-lg max-w-2xl mx-auto md:mx-0">
          Industry-grade courses in DSA, System Design, Web Development, DevOps &amp; more — built with hands-on projects and guided practice.
        </p>

        {/* Real catalog stats */}
        <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
          {[
            { icon: BookOpen, value: stats.total, label: 'Courses' },
            { icon: Gift, value: stats.free, label: 'Free' },
            { icon: Layers, value: stats.tracks, label: 'Tracks' },
          ].map((s) => (
            <div key={s.label} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
              <s.icon size={16} className="text-cyan-400" />
              <span className="text-lg font-extrabold text-white">{s.value}</span>
              <span className="text-xs text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Search bar */}
        <div className="mt-6 relative max-w-xl mx-auto md:mx-0">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, mentors, or topics…"
            aria-label="Search courses"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-11 text-sm text-white placeholder:text-gray-500 transition-colors focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
      {/* ===== Featured course (default view only) ===== */}
      {isDefaultView && featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.07] via-[#0c0c0f] to-[#0c0c0f] shadow-[0_0_60px_rgba(6,182,212,0.08)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[220px] overflow-hidden lg:min-h-full">
              <img src={featured.thumbnail} alt={featured.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0f] via-transparent to-transparent lg:bg-gradient-to-r" />
              <span className="absolute left-4 top-4 rounded-full bg-cyan-500 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-black">★ Featured</span>
            </div>
            <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                {featured.tags?.map((t) => (
                  <span key={t} className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-gray-300 ring-1 ring-white/10">{t}</span>
                ))}
              </div>
              <h3 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">{featured.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{featured.description}</p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={featured.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-[0_0_22px_rgba(6,182,212,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  Enroll Now
                </a>
                <button
                  type="button"
                  onClick={() => setSelected(featured)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-gray-200 transition-colors hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {/* ===== Filter / control bar ===== */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {STATUS_TABS.map((tab) => {
              const active = status === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatus(tab.id)}
                  aria-pressed={active}
                  className={twMerge(clsx(
                    'relative px-4 py-2 rounded-full text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
                    active ? 'text-black' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  ))}
                >
                  {active && (
                    <motion.span layoutId="courseFilterPill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <div className="ml-auto flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-gray-500" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort courses"
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-gray-200 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id} className="bg-[#111] text-white">{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Topic chips */}
        {topicOptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {topicOptions.map((t) => {
              const on = topics.has(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTopic(t)}
                  aria-pressed={on}
                  className={twMerge(clsx(
                    'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
                    on ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-200' : 'border-white/10 bg-white/[0.03] text-gray-400 hover:text-white hover:border-white/20'
                  ))}
                >
                  {t}
                </button>
              );
            })}
          </div>
        )}

        {/* Results count + clear */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-500">
            Showing <span className="font-bold text-white">{results.length}</span> {results.length === 1 ? 'course' : 'courses'}
          </p>
          {hasActiveFilters && (
            <button onClick={clearAll} className="inline-flex items-center gap-1.5 font-semibold text-cyan-400 transition-colors hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded">
              <X size={14} /> Clear all
            </button>
          )}
        </div>
      </div>
      {/* ===== Grid / empty state ===== */}
      {results.length > 0 ? (
        <motion.div
          key={`${status}-${sort}-${[...topics].join(',')}-${query}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch empty-space-zone"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {results.map((course) => (
            <motion.div
              key={course.id}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } }}
              className="flex h-full"
            >
              <CourseCard course={course} onViewDetails={setSelected} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-[#111] rounded-2xl border border-white/5 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/10">
            <Search size={24} className="text-gray-500" />
          </div>
          <p className="text-xl font-bold text-gray-300 mb-2">No courses found</p>
          <p className="text-gray-500 max-w-sm">No courses match your current search and filters. Try broadening your search or clearing the filters.</p>
          <button onClick={clearAll} className="mt-6 inline-flex items-center gap-1.5 text-accent-primary hover:text-white transition-colors text-sm font-bold">
            <X size={15} /> Clear all filters
          </button>
        </div>
      )}
      <CourseDetailsModal course={selected} onClose={() => setSelected(null)} onSelectCourse={(c) => setSelected(c)} />
    </section>
  );
};

export default CourseGrid;

import { useState, useEffect, useRef } from 'react';
import { Menu, X, Zap, Home, BookOpen, Code2, Swords, Brain, Network, Trophy, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// Fixed navbar height (h-20 = 80px) + a little breathing room, used everywhere
// we compute a scroll target so section headings aren't hidden underneath it.
const NAV_OFFSET = 88;

// Navigation model — each item pairs a readable label with a consistent icon.
// Home & Courses are on the home page (hash targets); the rest are the real
// strikes.in destinations and open in a new tab. `internal` marks the two that
// scroll/route within the SPA.
const LINKS = [
  { name: 'Home', href: '/', icon: Home, internal: true },
  { name: 'Courses', href: '/#courses', icon: BookOpen, internal: true },
  { name: 'Practice', href: 'https://strikes.in/practice', icon: Code2, internal: false },
  { name: 'CodeArena', href: 'https://strikes.in/codearena', icon: Swords, internal: false },
  { name: 'Quiz', href: 'https://strikes.in/quiz', icon: Brain, internal: false },
  { name: 'System Design', href: 'https://strikes.in/system-design', icon: Network, internal: false },
  { name: 'Contests', href: 'https://strikes.in/contests', icon: Trophy, internal: false },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const location = useLocation();
  const navigate = useNavigate();
  // When an internal hash link is clicked from a non-home route, we stash the
  // target id and scroll once Home has mounted (fixes "Courses stays on Home").
  const pendingScroll = useRef<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy for on-page sections. We use scroll position (not
  // IntersectionObserver): the global `overflow-x: hidden` on <body> splits the
  // scroll container, so a thin intersection band never reliably fires. Instead
  // we pick the last section whose top has scrolled under the fixed navbar.
  useEffect(() => {
    if (location.pathname !== '/') return;
    const sections = [
      { id: 'home', name: 'Home' },
      { id: 'courses', name: 'Courses' },
    ];
    const handleSpy = () => {
      const y = window.scrollY + 120;
      let current = 'Home';
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= y) current = sec.name;
        }
      }
      setActiveLink(current);
    };
    handleSpy();
    window.addEventListener('scroll', handleSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleSpy);
  }, [location.pathname]);

  // Run any scroll target queued by a cross-route internal link, once Home has
  // mounted its sections.
  useEffect(() => {
    if (location.pathname === '/' && pendingScroll.current) {
      const id = pendingScroll.current;
      pendingScroll.current = null;
      requestAnimationFrame(() =>
        window.setTimeout(() => scrollToId(id), 60)
      );
    }
  }, [location.pathname]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  };

  // Central click handler. External links keep their default (new-tab) behavior;
  // internal links are handled in-SPA so navigation always lands correctly.
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: { name: string; href: string; internal: boolean }
  ) => {
    setIsOpen(false);
    if (!link.internal) return; // external: let the anchor open in a new tab
    e.preventDefault();
    setActiveLink(link.name);
    if (link.href === '/') {
      if (location.pathname !== '/') navigate('/');
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const id = link.href.split('#')[1];
    if (location.pathname !== '/') {
      pendingScroll.current = id; // scroll after Home mounts
      navigate('/');
    } else {
      scrollToId(id);
    }
  };


  return (
    <nav
      className={clsx(
        'fixed w-full top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#08080a]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">

          {/* ===== Brand logo — clickable, glowing lightning bolt + wordmark ===== */}
          <Link
            to="/"
            onClick={(e) => handleLinkClick(e, { name: 'Home', href: '/', internal: true })}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl"
            aria-label="Strike — go to home"
          >
            <span className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-600/10 border border-cyan-400/20 transition-all duration-300 group-hover:border-cyan-400/50 group-hover:from-cyan-500/25">
              <span aria-hidden="true" className="absolute inset-0 rounded-xl bg-cyan-400/25 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <Zap
                size={20}
                fill="currentColor"
                className="relative text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[18deg]"
              />
            </span>
            <span className="font-display text-2xl font-extrabold tracking-tight leading-none text-white transition-colors duration-300 group-hover:text-cyan-200">
              STRIKE
            </span>
          </Link>

          {/* ===== Desktop nav — glassmorphism floating pill ===== */}
          <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-xl px-2 py-1.5 shadow-lg shadow-black/30">
              {LINKS.map((link) => {
                const isActive = link.internal && activeLink === link.name;
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={link.internal ? undefined : '_blank'}
                    rel={link.internal ? undefined : 'noopener noreferrer'}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold tracking-wide whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 bg-white/10 rounded-full shadow-[0_0_14px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/30 pointer-events-none"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className={clsx('relative z-10 flex items-center gap-1.5 transition-colors', isActive ? 'text-cyan-300' : 'text-gray-400 hover:text-white')}>
                      <Icon size={14} className={clsx('shrink-0 transition-colors', isActive ? 'text-cyan-300' : 'text-gray-500 group-hover:text-current')} />
                      {link.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* ===== Get Started CTA (desktop/tablet) ===== */}
          <div className="hidden lg:flex items-center">
            <Link
              to="/signup"
              className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_6px_22px_rgba(6,182,212,0.35)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080a]"
            >
              <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          {/* ===== Mobile hamburger ===== */}
          <div className="flex xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg border border-white/10 bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* ===== Mobile drawer ===== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="xl:hidden overflow-hidden border-b border-white/10 bg-[#08080a]/95 backdrop-blur-xl"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
              {LINKS.map((link) => {
                const isActive = link.internal && activeLink === link.name;
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={link.internal ? undefined : '_blank'}
                    rel={link.internal ? undefined : 'noopener noreferrer'}
                    onClick={(e) => handleLinkClick(e, link)}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
                      isActive
                        ? 'bg-white/10 text-cyan-300 ring-1 ring-cyan-400/30'
                        : 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
                    )}
                  >
                    <Icon size={18} className={clsx('shrink-0', isActive ? 'text-cyan-300' : 'text-gray-500')} />
                    {link.name}
                  </a>
                );
              })}
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="mt-2 group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_6px_22px_rgba(6,182,212,0.35)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(6,182,212,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                Get Started
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
};

export default Navbar;

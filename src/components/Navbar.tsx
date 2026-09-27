import { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy for sections. We use scroll position (not IntersectionObserver):
  // the global `overflow-x: hidden` on <body> splits the scroll container, and a
  // thin intersection band never reliably fires because the tall Memberships
  // section sits between Home and Courses. Instead we pick the last section whose
  // top has scrolled under the fixed navbar — deterministic and robust.
  useEffect(() => {
    if (location.pathname !== '/') return;

    const sections = [
      { id: 'home', name: 'Home' },
      { id: 'courses', name: 'Courses' }
    ];
    const NAV_OFFSET = 120; // fixed navbar (80px) + a little into the section

    const handleSpy = () => {
      const y = window.scrollY + NAV_OFFSET;
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

  // Initial load logic for Hash
  useEffect(() => {
    if (location.hash === '#courses') setActiveLink('Courses');
  }, [location.hash]);

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/#courses' },
    { name: 'Practice', href: 'https://strikes.in/practice' },
    { name: 'CodeArena', href: 'https://strikes.in/codearena' },
    { name: 'Quiz', href: 'https://strikes.in/quiz' },
    { name: 'System Design', href: 'https://strikes.in/system-design' },
    { name: 'Contests', href: 'https://strikes.in/contests' },
  ];

  const handleLinkClick = (name: string, href: string) => {
    setActiveLink(name);
    setIsOpen(false);

    // Smooth scrolling for internal anchor links. We compute the target position
    // manually and drive window.scrollTo instead of Element.scrollIntoView: the
    // global `overflow-x: hidden` on <body> promotes it to a scroll container, so
    // scrollIntoView can target the wrong scroller. window.scrollTo always moves
    // the viewport, and we subtract the fixed navbar height (h-20 = 80px) plus a
    // little breathing room so section headings aren't hidden underneath it.
    if (href.startsWith('/#')) {
      const id = href.split('#')[1];
      const el = document.getElementById(id);
      if (el) {
        const NAV_OFFSET = 88;
        const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
        window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
      }
    } else if (href === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={clsx(
        "fixed w-full top-0 z-50 transition-all duration-300",
        scrolled ? "bg-[#08080a]/90 backdrop-blur-lg border-b border-white/5 shadow-lg shadow-black/40" : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" onClick={() => handleLinkClick('Home', '/')} className="flex items-center gap-2 text-white group focus:outline-none">
              <Zap size={28} fill="currentColor" className="text-cyan-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              <span className="font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-cyan-400">STRIKE</span>
            </Link>
          </div>

          {/* Desktop Nav — centered floating pill (matches strikes.in signature nav) */}
          <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md px-2 py-1.5 shadow-lg shadow-black/20">
              {links.map((link) => {
                const isActive = activeLink === link.name;

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={link.href.startsWith('/') ? undefined : "_blank"}
                    rel={link.href.startsWith('/') ? undefined : "noopener noreferrer"}
                    onClick={(e) => {
                      if (link.href.startsWith('/')) {
                        e.preventDefault();
                      }
                      handleLinkClick(link.name, link.href);
                    }}
                    className="relative px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    {/* Active filled pill — the sliding indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 bg-white/10 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.2)] pointer-events-none"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className={clsx("relative z-10", isActive ? "text-white" : "text-gray-300 hover:text-white")}>
                      {link.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="relative group overflow-hidden bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </span>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex xl:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-400 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X size={26} /> : <Menu size={26} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-[#08080a]/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-1">
              {links.map((link, i) => {
                const isActive = activeLink === link.name;
                
                return (
                  <motion.a
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={link.name} 
                    href={link.href} 
                    target={link.href.startsWith('/') ? undefined : "_blank"}
                    rel={link.href.startsWith('/') ? undefined : "noopener noreferrer"}
                    onClick={(e) => {
                      if (link.href.startsWith('/')) {
                        e.preventDefault();
                      }
                      handleLinkClick(link.name, link.href);
                    }}
                    className={clsx(
                      "px-4 py-3 rounded-xl text-base font-semibold tracking-wide transition-colors relative flex items-center gap-3",
                      isActive ? "text-cyan-400 bg-cyan-900/20" : "text-gray-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="mobile-active-indicator"
                        className="w-1.5 h-6 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                      />
                    )}
                    <span className={clsx(!isActive && "ml-4")}>{link.name}</span>
                  </motion.a>
                );
              })}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.05 }}
                className="pt-6 mt-2 border-t border-white/10"
              >
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="bg-white text-black hover:bg-gray-200 w-full py-4 rounded-xl font-bold text-center flex justify-center items-center gap-2 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Get Started →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

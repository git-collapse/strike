import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { OverclockProvider, useOverclock } from './context/OverclockContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MembershipPlans from './components/MembershipPlans';
import CourseGrid from './components/CourseGrid';
import ProgressTracker from './components/ProgressTracker';
import WhyStrike from './components/WhyStrike';
import Mentors from './components/Mentors';
import Testimonials from './components/Testimonials';
import FaangBand from './components/FaangBand';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import SaleDiscovery from './components/SaleDiscovery';
import TerminalOverlay from './components/TerminalOverlay';
import SectionDivider from './components/SectionDivider';
import { DeveloperBackground } from './components/DeveloperBackground';

// The auth screens live on their own routes and aren't needed for the homepage,
// so we code-split them out of the main bundle (loaded on demand).
const Login = lazy(() => import('./pages/Login'));

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DeveloperBackground />
      <Navbar />
      <main className="flex-grow pt-16 empty-space-zone">
        <Hero />
        <MembershipPlans />
        <CourseGrid />
        <ProgressTracker />
        <WhyStrike />
        <Mentors />
        <SectionDivider label="reviews" />
        <Testimonials />
        <FaangBand />
        <SectionDivider label="faq" />
        <FAQ />
      </main>
      <Footer />
    </motion.div>
  );
};

const MainLayout = () => {
  const { isOverclocked } = useOverclock();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // One-shot "power surge" when Standard → Overclock: a brief cyan bloom sweeps
  // the viewport once, then the persistent grid settles in. Fires only on the
  // transition (not on refresh-restored grants) and is skipped for reduced motion.
  // The bloom self-clears via onAnimationComplete so it never lingers.
  const [surge, setSurge] = useState(false);
  const prevOverclocked = useRef(isOverclocked);
  useEffect(() => {
    if (!prevOverclocked.current && isOverclocked && !shouldReduceMotion) {
      setSurge(true);
    }
    prevOverclocked.current = isOverclocked;
  }, [isOverclocked, shouldReduceMotion]);

  // Deterministic cleanup: the bloom is cosmetic and must never linger. We clear
  // it primarily via onAnimationComplete, but rAF callbacks can be dropped if the
  // tab is backgrounded/throttled — so a timeout guarantees the overlay unmounts
  // even if the animation callback never fires. Runs slightly past the 0.9s anim.
  useEffect(() => {
    if (!surge) return;
    const id = window.setTimeout(() => setSurge(false), 1100);
    return () => window.clearTimeout(id);
  }, [surge]);

  return (
    <div className="min-h-screen relative transition-colors duration-1000 bg-bg-base">

      {/* Overclock Grid Background — reveals with a subtle zoom-settle as it fades in */}
      <div
        className={`fixed inset-0 pointer-events-none transition-[opacity,transform] duration-1000 z-0 ${isOverclocked ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      />

      {/* One-shot activation bloom (self-clearing) */}
      {surge && (
        <motion.div
          key="oc-surge"
          className="fixed inset-0 z-[95] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.55, 0] }}
          transition={{ duration: 0.9, ease: 'easeOut', times: [0, 0.3, 1] }}
          onAnimationComplete={() => setSurge(false)}
          style={{ background: 'radial-gradient(circle at center, rgba(34,211,238,0.35), rgba(59,130,246,0.12) 45%, transparent 72%)' }}
        />
      )}

      <div className="relative z-10 flex flex-col min-h-screen empty-space-zone">
        <AnimatePresence mode="wait">
          <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Login />} />
              <Route path="/forgot-password" element={<Login />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </div>

      <SaleDiscovery onTrigger={() => setIsTerminalOpen(true)} />
      <TerminalOverlay isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <OverclockProvider>
      <MainLayout />
    </OverclockProvider>
  );
}

export default App;

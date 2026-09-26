import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OverclockProvider, useOverclock } from './context/OverclockContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MembershipPlans from './components/MembershipPlans';
import CourseGrid from './components/CourseGrid';
import Footer from './components/Footer';
import SaleDiscovery from './components/SaleDiscovery';
import TerminalOverlay from './components/TerminalOverlay';
import Login from './pages/Login';
import { DeveloperBackground } from './components/DeveloperBackground';

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
      </main>
      <Footer />
    </motion.div>
  );
};

const MainLayout = () => {
  const { isOverclocked } = useOverclock();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const location = useLocation();

  return (
    <div className={`min-h-screen relative transition-colors duration-1000 ${isOverclocked ? 'bg-bg-base' : 'bg-bg-base'}`}>
      
      {/* Overclock Grid Background */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0 ${isOverclocked ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen empty-space-zone">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route path="/forgot-password" element={<Login />} />
          </Routes>
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

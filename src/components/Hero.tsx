import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { HeroMascot } from './HeroMascot';
import HeroCodePanel from './HeroCodePanel';

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div id="home" className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden bg-[#08080a] empty-space-zone">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 empty-space-zone">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 empty-space-zone">
          
          {/* Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left flex-1 max-w-2xl mx-auto lg:mx-0 mt-4 lg:mt-0"
          >
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.15]">
              Take control of your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Future With Strike</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-6 text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Master DSA, System Design & AI with interactive coding environments, premium mentorship, and industry-grade projects.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/login" className="px-6 py-2 sm:px-8 sm:py-3.5 rounded-full text-white font-medium cursor-pointer text-base bg-gradient-to-r from-zinc-800 to-zinc-900 border border-white/20 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-white/40 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white">
                Join Us
              </Link>
            </motion.div>
          </motion.div>

          <HeroMascot />

        </div>

        <HeroCodePanel />
      </div>
    </div>
  );
};

export default Hero;

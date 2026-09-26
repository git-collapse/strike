import { Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white mb-6">
              <Zap size={24} fill="currentColor" className="text-accent-primary" />
              <span className="text-xl font-black tracking-tight">STRIKE</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Empowering developers with cutting-edge tools and resources. Powered by Coder Army, Strike
              is your gateway to a world of endless coding with guided lessons, real projects, and a place
              to level up your skills.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Platform</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="https://strikes.in/practice" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Practice</a></li>
              <li><a href="https://strikes.in/practice" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">DSA Sheet</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="https://strikes.in/contact" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="https://strikes.in/terms" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="https://strikes.in/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2025 STRIKE. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <a href="https://www.youtube.com/@CoderArmy9" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a>
            <a href="https://www.instagram.com/coder_army9/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="https://www.linkedin.com/company/coderarmy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, BookOpen, Code, Trophy, Target } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const isSignup = location.pathname === '/signup';
  const isForgot = location.pathname === '/forgot-password';

  // Clear states on route change
  useEffect(() => {
    setError(null);
    setSuccess(null);
    setIdentifier('');
    setPassword('');
  }, [location.pathname]);

  const steps = [
    {
      icon: <BookOpen className="w-5 h-5 text-accent-primary" />,
      title: 'Enroll in Courses',
      description: 'Choose from our comprehensive curriculum taught by industry experts.'
    },
    {
      icon: <Code className="w-5 h-5 text-accent-primary" />,
      title: 'Learn & Practice',
      description: 'Hands-on learning with interactive coding environments and real-time feedback.'
    },
    {
      icon: <Target className="w-5 h-5 text-accent-primary" />,
      title: 'Build Projects',
      description: 'Apply your knowledge by building production-ready applications.'
    },
    {
      icon: <Trophy className="w-5 h-5 text-accent-primary" />,
      title: 'Get Hired',
      description: 'Ace your interviews with our dedicated placement support and mock interviews.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    try {
      if (!identifier.trim()) throw new Error('Email or Phone number is required.');

      if (isSignup) {
        if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');
        
        // Demo Auth: Save to localStorage
        localStorage.setItem('strike_demo_user', JSON.stringify({ identifier, password }));
        setSuccess('Account created successfully! You can now sign in.');
        
        // Clear fields so they can sign in or navigate them
        setIdentifier('');
        setPassword('');
        setTimeout(() => navigate('/login'), 2000);
      } 
      else if (isForgot) {
        setSuccess(`Password reset instructions have been sent to ${identifier} (Demo).`);
        setIdentifier('');
      }
      else {
        // isLogin
        if (!password) throw new Error('Password is required.');

        const savedUser = localStorage.getItem('strike_demo_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed.identifier === identifier && parsed.password === password) {
            localStorage.setItem('strike_demo_auth', 'true');
            navigate('/');
            return;
          }
        }
        throw new Error('Invalid credentials. Please try again or sign up.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-bg-base text-white flex"
    >
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          {/* Logo / Back Button */}
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-white hover:text-accent-primary transition-colors mb-12"
          >
            <Zap size={28} fill="currentColor" className="text-accent-primary" />
            <span className="text-2xl font-black tracking-tight">STRIKE</span>
          </button>

          <h1 className="text-3xl font-bold mb-2">
            {isSignup ? 'Create an Account' : isForgot ? 'Reset Password' : 'Welcome Back'}
          </h1>
          <p className="text-gray-400 mb-8">
            {isSignup ? 'Start your learning journey with Strike.' : isForgot ? 'Enter your email to receive reset instructions.' : 'Please enter your details to sign in.'}
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                {success}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Email or Phone number</label>
              <input 
                type="text" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email or phone" 
                required
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary transition-colors"
              />
            </div>

            {!isForgot && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" 
                    required={!isForgot}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary transition-colors"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {!isForgot && (
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="rounded border-gray-600 bg-[#111]" />
                  <label htmlFor="remember" className="text-sm text-gray-400">Remember me</label>
                </div>
                {!isSignup && (
                  <Link to="/forgot-password" className="text-sm font-medium text-accent-primary hover:text-blue-400 transition-colors">
                    Forgot Password?
                  </Link>
                )}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-accent-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-colors mt-6 shadow-lg shadow-blue-500/20"
            >
              {isLoading 
                ? (isSignup ? 'Signing Up...' : isForgot ? 'Sending...' : 'Signing In...') 
                : (isSignup ? 'Sign Up' : isForgot ? 'Send Reset Link' : 'Sign In')}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 text-sm">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <Link to="/login" className="text-white font-medium hover:text-accent-primary transition-colors">
                  Sign in
                </Link>
              </>
            ) : isForgot ? (
              <>
                Remember your password?{' '}
                <Link to="/login" className="text-white font-medium hover:text-accent-primary transition-colors">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/signup" className="text-white font-medium hover:text-accent-primary transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Right Section - Visual/Info */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0c] border-l border-white/5 relative overflow-hidden flex-col justify-center px-16">
        {/* Glow effect */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-accent-primary/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-bold text-white mb-4">Your Learning Journey</h2>
          <p className="text-gray-400 text-lg mb-12">
            Master the most in-demand skills and accelerate your tech career with Strike.
          </p>

          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:bg-accent-primary/10 group-hover:border-accent-primary/30">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;

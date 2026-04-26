import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Phone, Calendar, User, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';
import AuthModal from '../auth/AuthModal';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Departments', href: '/departments' },
  { name: 'Doctors', href: '/doctors' },
  { name: 'AI Assist', href: '/ai-diagnosis' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { isAdmin } = useAuth();

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-white/80 backdrop-blur-md py-4 border-b border-slate-100 shadow-sm" : "bg-transparent py-6 border-b border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-brand-primary p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-brand-slate">
                <span className="text-brand-slate">Well</span><span className="text-brand-primary">Care</span> Hospitals
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      "text-[15px] font-medium transition-all hover:text-brand-primary",
                      location.pathname === link.href ? "text-brand-primary" : "text-slate-600"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center space-x-6 pl-4 border-l border-slate-200">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link 
                        to="/admin"
                        className={cn(
                          "text-[15px] font-bold transition-all",
                          location.pathname === '/admin' ? "text-brand-primary" : "text-brand-slate hover:text-brand-primary"
                        )}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link 
                      to="/my-bookings"
                      className={cn(
                        "text-[15px] font-bold transition-all",
                        location.pathname === '/my-bookings' ? "text-brand-primary" : "text-brand-primary/80 hover:text-brand-primary"
                      )}
                    >
                      My Bookings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 text-slate-600 text-[15px] font-medium hover:text-red-500 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleAuthClick('login')}
                    className="text-slate-600 text-[15px] font-medium hover:text-brand-primary"
                  >
                    Login
                  </button>
                )}

                <Link 
                  to="/appointment" 
                  className="bg-brand-primary text-white pl-4 pr-6 py-2.5 rounded-full text-[14px] font-bold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2 group"
                >
                  <div className="bg-white/20 p-1 rounded-md">
                    <Calendar className="h-4 w-4" />
                  </div>
                  Book Appointment
                </Link>
              </div>
            </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-brand-primary transition-colors p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-3 text-base font-medium rounded-md",
                    location.pathname === link.href 
                      ? "bg-brand-light text-brand-primary" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-brand-primary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 mt-2">
                <Link
                  to="/appointment"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-brand-primary text-white px-4 py-3 rounded-xl font-semibold shadow-md mb-4"
                >
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </Link>
                
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 w-full bg-brand-slate text-white px-4 py-3 rounded-xl font-semibold mb-4"
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 px-4 py-3 rounded-xl font-semibold"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAuthClick('login')}
                      className="px-4 py-3 bg-slate-50 text-brand-slate rounded-xl font-bold text-sm"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleAuthClick('signup')}
                      className="px-4 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm"
                    >
                      Join
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 mt-6 text-brand-primary font-medium">
                  <Phone className="h-4 w-4" />
                  <span>1-800-WELLCARE</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authMode}
      />
    </nav>
  </>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { landingData } from '../../data/mockData';

interface NavbarProps {
  readonly className?: string;
}

const SECTION_MAP: Record<string, string> = {
  'Home': '/',
  'How It Works': '#how-it-works',
  'Coverage Plans': '#pricing',
  'Why Us': '#triggers',
};

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const { nav } = landingData;
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = (label: string) => {
    const target = SECTION_MAP[label];
    if (!target || target === '/') {
      navigate('/');
      return;
    }
    // If on landing page, scroll to section
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to landing page then scroll
      navigate('/');
      setTimeout(() => {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg ${className}`}>
      <div className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-serif italic font-bold text-primary">{nav.logo}</Link>
        
        <div className="hidden md:flex items-center space-x-10 text-sm font-medium text-secondary">
          {nav.links.map((link) => (
            <button 
              key={link.label}
              onClick={() => handleNavClick(link.label)}
              className={`${link.label === 'Home' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'hover:text-primary transition-colors'} bg-transparent border-none cursor-pointer`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link 
                to={user?.role === 'admin' ? '/admin/dashboard' : '/worker/dashboard'} 
                className="px-6 py-2 text-primary font-bold text-sm hover:underline"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="border border-primary text-primary px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-6 py-2 text-primary font-bold text-sm">Login</Link>
              <button 
                onClick={() => navigate('/onboarding')}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 group transition-transform hover:scale-105"
              >
                {nav.cta}
                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

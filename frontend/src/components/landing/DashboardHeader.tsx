import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface DashboardHeaderProps {
  readonly className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ className = '' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/worker/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const activeClass = "text-primary font-bold border-b-2 border-primary pb-1";
  const inactiveClass = "text-secondary font-medium hover:text-primary transition-colors";

  return (
    <header className={`w-full px-8 py-6 max-w-screen-2xl mx-auto flex justify-between items-center ${className}`}>
      <div className="flex items-center space-x-12">
        <Link to="/" className="text-3xl font-serif font-bold italic tracking-tight text-primary">Insurly</Link>
        <nav className="hidden md:flex space-x-8">
          <Link to="/worker/dashboard" className={isActive('/worker/dashboard') ? activeClass : inactiveClass}>Dashboard</Link>
          <Link to="/worker/policy" className={isActive('/worker/policy') ? activeClass : inactiveClass}>My Policy</Link>
          <Link to="/worker/claims" className={isActive('/worker/claims') ? activeClass : inactiveClass}>My Claims</Link>
        </nav>
      </div>
      <button 
        onClick={handleLogout}
        className="border border-primary px-8 py-2 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all"
      >
        Logout
      </button>
    </header>
  );
};

export default DashboardHeader;

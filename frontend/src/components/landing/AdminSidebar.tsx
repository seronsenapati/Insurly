import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 overflow-y-auto bg-muted dark:bg-slate-950 flex flex-col py-8 gap-2 font-sans antialiased border-r border-border/5">
      <div className="px-8 mb-8">
        <Link to="/" className="font-serif italic text-2xl text-primary dark:text-white">Insurly</Link>
        <p className="text-[10px] text-secondary font-bold tracking-[0.2em] mt-1">EDITORIAL OVERSIGHT</p>
      </div>
      <nav className="flex-1 space-y-1">
        <Link 
          to="/admin/dashboard" 
          className="text-primary dark:text-white font-bold bg-white dark:bg-slate-800 rounded-full px-4 py-3 mx-4 flex items-center gap-3 transition-all duration-300 shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">dashboard</span>
          <span className="text-sm">Dashboard</span>
        </Link>
        <a 
          href="#claims" 
          className="text-secondary dark:text-slate-400 font-medium px-4 py-3 mx-4 flex items-center gap-3 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-lg">assignment_late</span>
          <span className="text-sm">Claims Registry</span>
        </a>
        <a 
          href="#zone-map" 
          className="text-secondary dark:text-slate-400 font-medium px-4 py-3 mx-4 flex items-center gap-3 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-lg">map</span>
          <span className="text-sm">Zone Risk Map</span>
        </a>
        <a 
          href="#fraud-queue" 
          className="text-secondary dark:text-slate-400 font-medium px-4 py-3 mx-4 flex items-center gap-3 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-lg">gpp_maybe</span>
          <span className="text-sm">Fraud Review</span>
        </a>
        <button 
          onClick={handleLogout}
          className="text-secondary dark:text-slate-400 font-medium px-4 py-3 mx-4 flex items-center gap-3 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300 w-full text-left"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span className="text-sm">Log Out</span>
        </button>
      </nav>
      <div className="px-6 mt-auto">
        <div className="mt-8 flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-border overflow-hidden ring-2 ring-white shadow-sm">
            <img alt="Admin User Avatar" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"/>
          </div>
          <div>
            <p className="text-xs font-bold text-primary">Alex Thompson</p>
            <p className="text-[10px] text-secondary font-medium">Chief Underwriter</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

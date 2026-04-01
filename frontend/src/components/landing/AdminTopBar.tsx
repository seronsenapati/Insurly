import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const AdminTopBar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="fixed top-0 right-0 w-full z-50 bg-background/80 backdrop-blur-md flex justify-between items-center px-10 py-6 border-b border-border/5 shadow-sm">
      <div className="flex items-center gap-8 flex-1">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-serif italic text-3xl text-primary font-bold mr-4">Insurly</Link>
          <div className="w-px h-8 bg-border"></div>
          <h2 className="font-serif text-2xl tracking-tight text-secondary">Oversight Dashboard</h2>
        </div>
        
        <div className="relative w-96 ml-8 hidden lg:block">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
          <input className="w-full bg-muted border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-1 focus:ring-primary text-sm font-sans placeholder:text-secondary/50" placeholder="Search protocols, claims..." type="text"/>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-secondary">
          <button className="hover:opacity-70 transition-opacity"><span className="material-symbols-outlined text-lg">notifications</span></button>
          <button className="hover:opacity-70 transition-opacity"><span className="material-symbols-outlined text-lg">settings</span></button>
        </div>
        <div className="w-px h-8 bg-border"></div>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="border border-border px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-destructive hover:border-destructive hover:text-white transition-all ml-2">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;

import React from 'react';
import { Link } from 'react-router-dom';

export const ActionShortcuts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Link to="/worker/claims" className="bg-primary text-primary-foreground p-6 rounded-[2rem] flex items-center justify-between group hover:scale-[1.01] transition-all duration-300 no-underline">
        <div className="text-left">
          <p className="text-xs opacity-60 mb-1">Manage my history</p>
          <p className="text-xl font-medium">View My Claims</p>
        </div>
        <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center group-hover:rotate-[-45deg] transition-transform">
          <span className="material-symbols-outlined">arrow_forward</span>
        </div>
      </Link>
      
      <Link to="/worker/policy" className="bg-muted text-primary p-6 rounded-[2rem] flex items-center justify-between group hover:scale-[1.01] transition-all duration-300 border border-border/5 no-underline">
        <div className="text-left">
          <p className="text-xs opacity-60 mb-1">Coverage details</p>
          <p className="text-xl font-medium">Policy Details</p>
        </div>
        <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center group-hover:rotate-[-45deg] transition-transform">
          <span className="material-symbols-outlined">arrow_forward</span>
        </div>
      </Link>
    </div>
  );
};

export default ActionShortcuts;

import React from 'react';

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="bg-muted py-16 px-8 mt-20 rounded-t-[3rem]">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="text-2xl font-serif font-bold italic mb-4 text-primary">Insurly</div>
          <p className="text-sm text-secondary">&copy; 2026 Insurly. The Modern Curator of Protection.</p>
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-primary">Help & Support</h4>
          <ul className="space-y-3 text-sm text-secondary">
            <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-primary">Company</h4>
          <ul className="space-y-3 text-sm text-secondary">
            <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;

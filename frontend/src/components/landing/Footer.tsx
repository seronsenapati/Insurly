import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { landingData } from '../../data/mockData';

interface FooterProps {
  readonly className?: string;
}

const FOOTER_LINK_MAP: Record<string, string> = {
  'How It Works': '#how-it-works',
  'Coverage Plans': '#pricing',
  'Triggers': '#triggers',
  'Support': '/',
  'Partners': '/',
};

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { footer } = landingData;
  const navigate = useNavigate();

  const handleLinkClick = (label: string) => {
    const target = FOOTER_LINK_MAP[label];
    if (target && target.startsWith('#')) {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  };

  return (
    <footer className={`py-20 px-8 border-t border-border/10 ${className}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="md:col-span-2 space-y-6">
          <Link to="/" className="text-2xl font-serif italic font-bold text-primary">{footer.logo}</Link>
          <p className="text-sm text-secondary leading-relaxed max-w-xs uppercase font-bold tracking-tighter">
            {footer.description}
          </p>
          <p className="text-[10px] text-secondary/60">{footer.tagline}</p>
        </div>

        {footer.sections.map((section) => (
          <div key={section.title}>
            <h5 className="font-bold text-[10px] uppercase tracking-widest text-secondary mb-6">{section.title}</h5>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-tighter text-secondary/70">
              {section.links.map((link) => (
                <li key={link}>
                  <button 
                    onClick={() => handleLinkClick(link)}
                    className="hover:text-primary transition-colors bg-transparent border-none cursor-pointer text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-widest text-secondary/40 uppercase">
        <p>&copy; 2026 Insurly Editorial Insurance. All rights reserved.</p>
        <div className="flex gap-8">
          <Link to="/">Security</Link>
          <Link to="/">Accessibility</Link>
          <Link to="/">Whistleblower</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

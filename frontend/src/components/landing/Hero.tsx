import React from 'react';
import { useNavigate } from 'react-router-dom';
import { landingData } from '../../data/mockData';

interface HeroProps {
  readonly className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className = '' }) => {
  const { hero } = landingData;
  const navigate = useNavigate();

  return (
    <section id="hero" className={`px-8 py-16 md:py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${className}`}>
      <div className="lg:col-span-6 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-muted rounded-full text-[10px] font-bold tracking-widest text-secondary uppercase">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          {hero.badge}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif font-medium leading-[1] text-primary">
          {hero.title.split('.').map((part, i, arr) => (
            <React.Fragment key={part}>
              {i === 1 ? <span className="font-serif italic block">{part}.</span> : part + (i < arr.length - 1 ? '.' : '')}
            </React.Fragment>
          ))}
        </h1>

        <p className="text-lg text-secondary max-w-md leading-relaxed">
          {hero.subtitle}
        </p>

        <div className="flex flex-wrap items-center gap-8 pt-4">
          <button 
            onClick={() => navigate('/onboarding')}
            className="bg-primary text-primary-foreground flex items-center gap-3 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform group shadow-lg shadow-primary/10"
          >
            {hero.primaryCta}
            <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </span>
          </button>
          <button 
            onClick={() => {
              const el = document.querySelector('#pricing');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-bold text-primary border-b border-primary/20 pb-1"
          >
            {hero.secondaryCta}
          </button>
        </div>
      </div>

      <div className="lg:col-span-6 relative">
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative aspect-[4/5] md:aspect-auto">
          <img 
            alt="Delivery Hero" 
            className="w-full h-full object-cover" 
            src={hero.image} 
          />
          
          {/* Payout Overlay */}
          <div className="absolute bottom-8 -left-8 md:-left-12 bg-white/90 backdrop-blur-md text-slate-900 p-6 rounded-2xl shadow-xl max-w-xs border border-white/20 animate-bounce">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500 rounded-full p-1">
                <span className="material-symbols-outlined text-white text-sm font-bold">check</span>
              </div>
              <span className="font-bold text-sm">{hero.payoutLabel}</span>
            </div>
            <p className="text-xs text-slate-600 leading-snug">
              {hero.payoutAmount}
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

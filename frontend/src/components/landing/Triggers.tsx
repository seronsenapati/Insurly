import React from 'react';
import { landingData } from '../../data/mockData';

interface TriggersProps {
  readonly className?: string;
}

export const Triggers: React.FC<TriggersProps> = ({ className = '' }) => {
  const { triggers } = landingData;

  return (
    <section id="triggers" className={`px-8 py-24 bg-white/30 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
        <div className="lg:w-1/3 space-y-6">
          <h2 className="text-4xl font-serif text-primary">
            {triggers.title.split('.').map((part, i) => (
              <React.Fragment key={part}>
                {i === 1 ? <span className="font-serif italic block">{part}</span> : part + '.'}
              </React.Fragment>
            ))}
          </h2>
          <p className="text-secondary text-sm leading-relaxed">{triggers.subtitle}</p>
        </div>

        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {triggers.items.map((item) => (
            <div key={item.label} className="bg-white p-8 rounded-[2rem] text-center space-y-4 shadow-sm hover:translate-y-[-4px] transition-transform">
              <span className={`material-symbols-outlined text-3xl ${item.color === 'blue' ? 'text-blue-500' : item.color === 'orange' ? 'text-orange-500' : item.color === 'slate' ? 'text-slate-700' : item.color === 'teal' ? 'text-teal-600' : 'text-red-500'}`}>
                {item.icon}
              </span>
              <h4 className="font-bold text-sm uppercase tracking-widest">{item.label}</h4>
              <p className="text-[10px] text-secondary">{item.value}</p>
            </div>
          ))}
          <div className="bg-primary p-8 rounded-[2rem] text-center flex items-center justify-center shadow-lg">
            <p className="text-primary-foreground font-bold text-sm">More coming soon...</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Triggers;

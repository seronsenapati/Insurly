import React from 'react';
import { landingData } from '../../data/mockData';

interface PartnerStripProps {
  readonly className?: string;
}

export const PartnerStrip: React.FC<PartnerStripProps> = ({ className = '' }) => {
  const { partners } = landingData;

  return (
    <section className={`py-16 border-y border-border/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-8">
        <p className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-secondary mb-12">Proud to partner with</p>
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-x-16 gap-y-10 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((partner) => (
            <span key={partner} className="text-lg font-bold font-serif">{partner}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerStrip;

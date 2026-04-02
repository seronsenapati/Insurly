import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CTAProps {
  readonly className?: string;
}

export const CTA: React.FC<CTAProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <section className={`px-8 py-24 ${className}`}>
      <div className="max-w-7xl mx-auto bg-primary rounded-[3rem] p-16 md:p-24 text-center space-y-12 relative overflow-hidden">
        {/* Abstract circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <h2 className="text-5xl md:text-7xl font-serif text-primary-foreground max-w-4xl mx-auto leading-[1.1]">
          Your next ride <span className="font-serif italic">is covered.</span>
        </h2>
        
        <div>
          <button 
            onClick={() => navigate('/onboarding')}
            className="bg-white text-primary inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform group shadow-2xl"
          >
            Get Protected Now
            <span className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;

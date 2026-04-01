import React from 'react';
import { useNavigate } from 'react-router-dom';
import { landingData } from '../../data/mockData';

interface PricingProps {
  readonly className?: string;
}

export const Pricing: React.FC<PricingProps> = ({ className = '' }) => {
  const { pricing } = landingData;
  const navigate = useNavigate();

  return (
    <section id="pricing" className={`px-8 py-24 max-w-7xl mx-auto ${className}`}>
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif text-primary">
          {pricing.title.split('.').map((part, i) => (
            <React.Fragment key={part}>
              {i === 1 ? <span className="font-serif italic "> {part}</span> : part + '.'}
            </React.Fragment>
          ))}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {pricing.plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`p-10 rounded-[2.5rem] flex flex-col space-y-8 relative transition-all duration-300 ${plan.featured ? 'bg-primary text-primary-foreground shadow-2xl scale-105 z-10' : 'bg-white border border-border/5 shadow-sm hover:shadow-md'}`}
          >
            {plan.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
                Most Popular
              </div>
            )}
            
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${plan.featured ? 'text-white/60' : 'text-secondary'}`}>{plan.name}</h3>
              <div className="text-4xl font-serif font-medium">
                {plan.price}
                <span className={`text-sm font-sans ml-1 ${plan.featured ? 'text-white/60' : 'text-secondary'}`}>{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 text-sm flex-grow">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-lg font-bold ${plan.featured ? 'text-green-400' : 'text-green-500'}`}>check</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => navigate('/onboarding')}
              className={`w-full py-4 rounded-full font-bold text-sm transition-all cursor-pointer ${plan.featured ? 'bg-white text-primary hover:scale-[1.02]' : 'border border-primary/20 hover:bg-primary hover:text-white'}`}
            >
              {plan.buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;

import React from 'react';
import { landingData } from '../../data/mockData';

interface FeaturesProps {
  readonly className?: string;
}

export const Features: React.FC<FeaturesProps> = ({ className = '' }) => {
  const { features } = landingData;

  return (
    <section id="how-it-works" className={`px-8 py-24 max-w-7xl mx-auto ${className}`}>
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif text-primary">
          {features.title.split(',').map((part, i) => (
            <React.Fragment key={part}>
              {i === 1 ? <span className="font-serif italic italic"> {part}</span> : part}
              {i === 0 ? ',' : ''}
            </React.Fragment>
          ))}
        </h2>
        <p className="text-secondary max-w-2xl mx-auto text-sm leading-relaxed">
          {features.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.steps.map((step) => (
          <div key={step.id} className="bg-card p-8 rounded-[2rem] space-y-6 border border-border/5 shadow-sm hover:shadow-md transition-shadow">
            <span className="w-12 h-12 flex items-center justify-center text-sm font-bold bg-muted rounded-full">
              {step.id}
            </span>
            <div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

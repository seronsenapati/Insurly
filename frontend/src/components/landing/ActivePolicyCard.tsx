import React from 'react';
import { usePolicy } from '@/hooks/usePolicy';
import { formatCurrency, formatDate, getTriggerIcon } from '@/utils/formatters';
import { Link } from 'react-router-dom';

const TIER_NAMES: Record<string, string> = {
  basic: 'Basic Protection Plan',
  standard: 'Standard Disruption Plan',
  premium: 'Premium Guardian Plan'
};

const TRIGGER_MAP: Record<string, { icon: string; label: string }> = {
  heavy_rain: { icon: 'rainy', label: 'Rain' },
  extreme_heat: { icon: 'sunny', label: 'Heatwave' },
  cyclone_storm: { icon: 'thunderstorm', label: 'Storm' },
  severe_pollution: { icon: 'air', label: 'Pollution' },
  zone_lockdown: { icon: 'block', label: 'Lockdown' }
};

export const ActivePolicyCard: React.FC = () => {
  const { activePolicy, isLoadingPolicy } = usePolicy();

  if (isLoadingPolicy) {
    return (
      <div className="bg-white rounded-[2rem] p-10 border border-border/10 shadow-sm animate-pulse">
        <div className="h-4 bg-muted rounded w-24 mb-4"></div>
        <div className="h-8 bg-muted rounded w-64 mb-10"></div>
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
        </div>
        <div className="h-12 bg-muted rounded"></div>
      </div>
    );
  }

  if (!activePolicy) {
    return (
      <div className="bg-white rounded-[2rem] p-10 border border-border/10 shadow-sm text-center space-y-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">No Active Policy</p>
        <h2 className="text-4xl font-serif text-primary italic">Get Protected Today</h2>
        <p className="text-secondary font-medium">You don't have an active coverage plan. Start your protection journey now.</p>
        <Link to="/onboarding" className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-transform">
          Get Coverage
        </Link>
      </div>
    );
  }

  const policyName = TIER_NAMES[activePolicy.tier] || 'Protection Plan';
  const statusColor = activePolicy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800';
  const triggers = activePolicy.activeTriggers || Object.keys(TRIGGER_MAP);
  const isExpiringSoon = activePolicy.endDate && (new Date(activePolicy.endDate).getTime() - new Date().getTime()) < 2 * 24 * 60 * 60 * 1000;
  const showRenew = activePolicy.status === 'expired' || isExpiringSoon;

  return (
    <div className="bg-white rounded-[2rem] p-10 border border-border/10 relative shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Active Policy</p>
        <span className={`${statusColor} text-[10px] font-bold px-3 py-1 rounded-full uppercase`}>
          {activePolicy.status}
        </span>
      </div>
      <h2 className="text-4xl font-serif text-primary italic mb-10">{policyName}</h2>
      
      <div className="grid grid-cols-3 gap-8 mb-12">
        <div>
          <p className="text-xs text-secondary mb-1">Weekly Premium</p>
          <p className="text-3xl font-bold font-serif">{formatCurrency(activePolicy.weeklyPremium)}</p>
        </div>
        <div>
          <p className="text-xs text-secondary mb-1">Max Weekly Payout</p>
          <p className="text-3xl font-bold font-serif">{formatCurrency(activePolicy.maxWeeklyPayout)}</p>
        </div>
        <div>
          <p className="text-xs text-secondary mb-1">Coverage Period</p>
          <p className="text-sm font-medium">{formatDate(activePolicy.startDate)} – {formatDate(activePolicy.endDate)}</p>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-4">Triggers Included</p>
        <div className="flex flex-wrap gap-4">
          {triggers.map((trigger: string) => {
            const t = TRIGGER_MAP[trigger] || { icon: 'help', label: trigger };
            return (
              <div key={trigger} className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center transition-transform hover:scale-110">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{t.icon}</span>
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest">{t.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {showRenew && (
        <Link to="/worker/renew" className="mt-8 inline-block w-full text-center bg-primary text-primary-foreground py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-transform">
          Renew Policy
        </Link>
      )}
    </div>
  );
};

export default ActivePolicyCard;

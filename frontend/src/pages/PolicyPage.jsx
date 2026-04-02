import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShieldCheck, Zap, CloudRain, Thermometer, Wind, Lock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../components/landing/DashboardHeader';
import { usePolicy } from '@/hooks/usePolicy';
import { formatCurrency, formatDate } from '@/utils/formatters';

const TIER_NAMES = {
  basic: 'Basic Protection Tier',
  standard: 'Standard Protection Tier',
  premium: 'Premium Guardian Tier'
};

const TRIGGERS = [
  { icon: CloudRain, name: 'Precipitation', threshold: '> 5mm Intensity' },
  { icon: Thermometer, name: 'Extreme Heat', threshold: '> 42°C Ambient' },
  { icon: Lock, name: 'Zone Closure', threshold: 'Govt. Mandated' }
];

export default function PolicyPage() {
  const { activePolicy, isLoadingPolicy } = usePolicy();

  if (isLoadingPolicy) {
    return (
      <div className="min-h-screen bg-background text-primary">
        <DashboardHeader />
        <main className="max-w-screen-2xl mx-auto px-8 pb-20 mt-10">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-64 bg-muted rounded-[3rem]"></div>
          </div>
        </main>
      </div>
    );
  }

  const policyName = activePolicy ? (TIER_NAMES[activePolicy.tier] || 'Protection Plan') : 'No Active Policy';
  const premium = activePolicy?.weeklyPremium || 0;
  const maxPayout = activePolicy?.maxWeeklyPayout || 0;
  const startDate = activePolicy?.startDate;
  const endDate = activePolicy?.endDate;

  return (
    <div className="min-h-screen bg-background text-primary">
      <DashboardHeader />
      
      <main className="max-w-screen-2xl mx-auto px-8 pb-20 mt-10">
        <div className="mb-12">
          <Link to="/worker/dashboard" className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary flex items-center gap-2 mb-4 hover:text-primary transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Portal Home
          </Link>
          <h1 className="text-6xl font-serif text-primary italic mb-4">Coverage Portfolio</h1>
          <p className="text-secondary max-w-xl font-medium italic">
            "An editorial-grade breakdown of your active parametric protections."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Active Policy Detail */}
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white rounded-[3rem] p-12 border border-border/10 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-4">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border inline-block ${activePolicy?.status === 'active' ? 'bg-primary/5 text-primary border-primary/10' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                    {activePolicy ? 'Active Coverage' : 'No Coverage'}
                  </div>
                  <h2 className="text-5xl font-serif font-bold italic">{policyName}</h2>
                  {endDate && <p className="text-secondary font-medium tracking-tight">Valid until {new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                </div>
                {activePolicy && (
                  <div className="text-right">
                    <p className="text-4xl font-serif font-bold italic">{formatCurrency(premium)}<span className="text-sm font-sans not-italic text-secondary">/wk</span></p>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mt-2">Premium Autopay</p>
                  </div>
                )}
              </div>

              {activePolicy && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Aggregate Protection</p>
                      <p className="text-3xl font-serif font-bold italic text-primary">{formatCurrency(maxPayout)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Verified Payout Base</p>
                      <p className="text-3xl font-serif font-bold italic text-primary">{formatCurrency(activePolicy.dailyPayoutAmount || 150)} <span className="text-sm not-italic font-sans text-secondary">per event</span></p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] border-b border-border/10 pb-4">Trigger Matrix</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {TRIGGERS.map(trigger => (
                        <div key={trigger.name} className="p-6 bg-muted rounded-[2rem] space-y-3">
                          <trigger.icon className="w-5 h-5 text-primary" />
                          <p className="font-serif italic font-bold">{trigger.name}</p>
                          <p className="text-[10px] uppercase tracking-widest text-secondary font-bold font-sans not-italic">{trigger.threshold}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {!activePolicy && (
                <div className="text-center py-12">
                  <p className="text-secondary font-medium italic mb-6">You don't have an active policy. Start your protection journey now.</p>
                  <Link to="/onboarding" className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-transform">
                    Get Coverage
                  </Link>
                </div>
              )}

              {/* Decorative background circle */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 -z-0" />
            </div>

            <div className="p-10 bg-primary text-primary-foreground rounded-[3rem] flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-serif font-bold italic">Need higher limits?</h4>
                  <p className="opacity-70 text-sm">Upgrade to Premium for ₹1,800 protection.</p>
                </div>
              </div>
              <Link to="/onboarding" className="px-8 py-4 bg-white text-primary rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
                Upgrade Tier
              </Link>
            </div>
          </div>

          {/* Sidebar / History */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2rem] border border-border/10 p-8 shadow-sm">
              <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-8">Archived Policies</h3>
              <div className="space-y-8">
                <div className="flex items-center justify-center p-12 border-2 border-dashed border-border rounded-[2rem]">
                  <p className="text-secondary italic text-sm text-center">Your historical portfolio is empty.</p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-8 rounded-[2rem] border border-border/10">
              <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4">How it works</h3>
              <p className="text-primary text-sm leading-relaxed italic">
                Parametric insurance triggers automatically when objective weather data from global sensors hits your threshold. No paperwork, just immediate relief.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
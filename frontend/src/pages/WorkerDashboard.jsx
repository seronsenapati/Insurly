import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePolicy } from '@/hooks/usePolicy';
import api from '@/services/api';
import toast from 'react-hot-toast';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import MockPaymentModal from '@/components/shared/MockPaymentModal';

import DashboardHeader from '../components/landing/DashboardHeader';
import AlertBanner from '../components/landing/AlertBanner';
import ActivePolicyCard from '../components/landing/ActivePolicyCard';
import ActionShortcuts from '../components/landing/ActionShortcuts';
import StatsSidebar from '../components/landing/StatsSidebar';
import RecentClaimsTable from '../components/landing/RecentClaimsTable';
import DashboardFooter from '../components/landing/DashboardFooter';

const WorkerDashboard = () => {
  const { user } = useAuth();
  const { activePolicy, isLoadingPolicy, fetchActivePolicy, purchasePolicy } = usePolicy();
  
  const [summary, setSummary] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [isGettingQuotes, setIsGettingQuotes] = useState(false);
  
  // Payment state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/analytics/worker/summary');
        setSummary(res.data.data);
      } catch (error) {
        console.error('Failed to fetch summary');
      }
    };
    fetchSummary();
  }, []);

  const handleGetQuotes = async () => {
    setIsGettingQuotes(true);
    try {
      const res = await api.post('/policy/quote');
      setQuotes(res.data.data);
    } catch (error) {
      toast.error('Failed to generate premium quotes');
    } finally {
      setIsGettingQuotes(false);
    }
  };

  const handlePurchaseIntent = (tier) => {
    setSelectedTier(tier);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      await purchasePolicy(selectedTier.tier);
      toast.success('Policy purchased! AI tracking active.');
      setIsPaymentModalOpen(false);
      setQuotes([]);
      fetchActivePolicy();
      // Refetch summary
      const res = await api.get('/analytics/worker/summary');
      setSummary(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to finish purchase');
    }
  };

  const getWeatherIcon = (iconCode) => {
    if (!iconCode) return 'partly_cloudy_day';
    if (iconCode.includes('01')) return 'light_mode';
    if (iconCode.includes('02')) return 'partly_cloudy_day';
    if (iconCode.includes('03') || iconCode.includes('04')) return 'cloud';
    if (iconCode.includes('09') || iconCode.includes('10')) return 'rainy';
    if (iconCode.includes('11')) return 'thunderstorm';
    if (iconCode.includes('13')) return 'cloudy_snowing';
    if (iconCode.includes('50')) return 'foggy';
    return 'partly_cloudy_day';
  };

  const getWeatherColor = (iconCode) => {
    if (!iconCode) return 'text-amber-500';
    if (iconCode.includes('01') || iconCode.includes('02')) return 'text-amber-500';
    if (iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11')) return 'text-blue-500';
    return 'text-slate-400';
  };

  if (isLoadingPolicy) return <LoadingSpinner size="lg" className="min-h-[50vh]" />;

  return (
    <div className="min-h-screen bg-background text-primary">
      <DashboardHeader />
      
      <main className="max-w-screen-2xl mx-auto px-8 pb-20 mt-10">
        <AlertBanner />
        
        {/* Greeting with Weather */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-6xl font-serif text-primary mb-2 flex items-center gap-4">
              Good morning, {user?.name || 'Partner'}
            </h1>
            <p className="text-secondary text-lg">Ready for your shift today? Your coverage is protecting your earnings.</p>
          </div>
          
          {summary?.weather ? (
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-border/5 shadow-sm shrink-0 self-start md:self-auto transition-all">
              <span className={`material-symbols-outlined text-3xl ${getWeatherColor(summary.weather.icon)}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {getWeatherIcon(summary.weather.icon)}
              </span>
              <div>
                <p className="font-bold text-primary text-xl leading-none mb-1">{Math.round(summary.weather.temp)}°C</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary leading-none">{summary.weather.description}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-border/5 shadow-sm shrink-0 self-start md:self-auto animate-pulse">
               <div className="w-8 h-8 rounded-full bg-muted"></div>
               <div>
                 <div className="w-12 h-5 bg-muted rounded mb-1"></div>
                 <div className="w-20 h-3 bg-muted rounded"></div>
               </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 space-y-8">
            <ActivePolicyCard />
            <ActionShortcuts />
          </div>
          <div className="lg:col-span-4">
            <StatsSidebar />
          </div>
        </div>

        <RecentClaimsTable />
      </main>

      <DashboardFooter />

      {/* Mock Payment Modal */}
      {isPaymentModalOpen && selectedTier && (
        <MockPaymentModal 
          amount={selectedTier.weeklyPremium}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setIsPaymentModalOpen(false)}
        />
      )}
    </div>
  );
};

export default WorkerDashboard;

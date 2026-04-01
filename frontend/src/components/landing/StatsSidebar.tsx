import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { formatCurrency } from '@/utils/formatters';

export const StatsSidebar: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/analytics/worker/summary');
        setSummary(res.data.data);
      } catch (error) {
        console.error('Failed to fetch worker summary');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
    const interval = setInterval(fetchSummary, 10000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: 'Earnings Protected',
      value: isLoading ? '—' : formatCurrency(summary?.earningsProtected ?? summary?.totalEarningsProtected ?? 0),
      trend: summary?.earningsProtectedTrend || null,
      color: 'indigo',
      icon: 'security'
    },
    {
      label: 'Claims Processed',
      value: isLoading ? '—' : String(summary?.claimsCount ?? summary?.claimsThisWeek ?? summary?.totalClaims ?? 0),
      subtext: 'All-time automated approvals',
      color: 'purple',
      icon: 'verified'
    },
    {
      label: 'Total Paid Out',
      value: isLoading ? '—' : formatCurrency(summary?.totalPayouts ?? summary?.payoutsReceived ?? 0),
      subtext: 'Transferred to linked UPI',
      color: 'blue',
      icon: 'payments'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-border/10 shadow-sm animate-pulse">
            <div className="h-4 bg-muted rounded w-24 mb-4"></div>
            <div className="h-8 bg-muted rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-8 rounded-[2rem] border border-border/10 shadow-sm flex items-start space-x-5 hover:shadow-md transition-shadow">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 
            stat.color === 'purple' ? 'bg-purple-50 text-purple-600' : 
            'bg-blue-50 text-blue-600'
          }`}>
            <span className="material-symbols-outlined">{stat.icon}</span>
          </div>
          <div>
            <p className="text-xs font-medium text-secondary mb-2">{stat.label}</p>
            <p className="text-4xl font-serif font-bold text-primary">{stat.value}</p>
            {stat.trend && <p className="text-[10px] font-bold text-green-700 mt-2">{stat.trend}</p>}
            {stat.subtext && <p className="text-[10px] text-secondary mt-2">{stat.subtext}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSidebar;

import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface AdminStatsGridProps {
  readonly overview?: any;
}

export const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({ overview }) => {
  const stats = [
    {
      label: 'Active Policies',
      value: overview?.activePolicies ?? overview?.totalActivePolicies ?? 0,
      trend: '+12%',
      trendIcon: 'trending_up'
    },
    {
      label: 'Claims This Week',
      value: overview?.claimsThisWeek ?? overview?.totalClaimsThisWeek ?? 0,
      trend: 'Stable'
    },
    {
      label: 'Payouts This Week',
      value: formatCurrency(overview?.payoutsThisWeek ?? overview?.totalPayoutsThisWeek ?? 0),
      trend: '+5%',
      trendIcon: 'trending_up',
      isError: true
    },
    {
      label: 'Fraud Flags',
      value: overview?.fraudFlags ?? overview?.openFraudFlags ?? 0,
      icon: 'warning',
      isCritical: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className={`bg-white p-6 rounded-2xl shadow-sm border border-border/5 hover:shadow-md transition-shadow ${stat.isCritical ? 'bg-red-50/50 border-red-100' : ''}`}>
          <p className={`text-[10px] font-bold tracking-widest uppercase ${stat.isCritical ? 'text-destructive' : 'text-secondary'}`}>{stat.label}</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className={`font-serif text-4xl ${stat.isCritical ? 'text-destructive' : 'text-primary'}`}>{stat.value}</h3>
            {stat.trend && (
              <span className={`font-bold flex items-center text-[10px] uppercase tracking-widest ${
                stat.isError ? 'text-destructive' : 'text-green-700'
              }`}>
                {stat.trend} {stat.trendIcon && <span className="material-symbols-outlined text-xs ml-1">{stat.trendIcon}</span>}
              </span>
            )}
            {stat.icon && <span className="material-symbols-outlined text-destructive" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsGrid;

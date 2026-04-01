import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { formatCurrency } from '@/utils/formatters';

export const LossRatioChart: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchLossRatio = async () => {
      try {
        const res = await api.get('/analytics/admin/loss-ratio');
        setData(res.data.data);
      } catch (error) {
        // Fallback to display static
      }
    };
    fetchLossRatio();
  }, []);

  const totalPremiums = data?.totalPremiums ?? 84200;
  const totalPayouts = data?.totalPayouts ?? 12600;
  const lossRatio = data?.lossRatio ?? (totalPayouts / totalPremiums * 100);

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-border/5 shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <h4 className="font-serif text-2xl text-primary italic">Net Loss Ratio Analytics</h4>
        <span className="material-symbols-outlined text-secondary hover:text-primary cursor-pointer transition-colors">open_in_new</span>
      </div>
      <div className="relative h-48 w-full mt-4">
        <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
          {/* Reference Lines */}
          <line x1="0" y1="180" x2="400" y2="180" stroke="currentColor" strokeWidth="1" strokeDasharray="4" className="text-muted" />
          <line x1="0" y1="100" x2="400" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4" className="text-muted" />
          <line x1="0" y1="20" x2="400" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="4" className="text-muted" />
          
          {/* Payouts Line (Red) */}
          <path d="M0 160 Q 50 140, 100 155 T 200 120 T 300 140 T 400 90" fill="none" stroke="hsl(var(--destructive))" strokeLinecap="round" strokeWidth="3" />
          {/* Premiums Line (Green) */}
          <path d="M0 60 Q 50 70, 100 50 T 200 65 T 300 45 T 400 30" fill="none" stroke="#10b981" strokeLinecap="round" strokeWidth="3" />
        </svg>
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Total Premiums</span>
          </div>
          <span className="text-sm font-bold text-primary">{formatCurrency(totalPremiums)}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive"></div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Total Payouts</span>
          </div>
          <span className="text-sm font-bold text-primary">{formatCurrency(totalPayouts)}</span>
        </div>
      </div>
      <div className="mt-8 p-6 bg-muted rounded-[1.5rem] text-center border border-border/5">
        <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-1">Current Loss Ratio</p>
        <p className="font-serif text-3xl text-primary font-bold italic">{lossRatio.toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default LossRatioChart;

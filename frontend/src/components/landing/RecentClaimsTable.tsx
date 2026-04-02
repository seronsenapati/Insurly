import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { formatCurrency, formatDate, formatTriggerType, getTriggerIcon } from '@/utils/formatters';

export const RecentClaimsTable: React.FC = () => {
  const [claims, setClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await api.get('/claims/my-claims');
        setClaims((res.data.data || []).slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch recent claims');
      } finally {
        setIsLoading(false);
      }
    };
    fetchClaims();
    const interval = setInterval(fetchClaims, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusStyle = (status: string) => {
    if (status === 'paid') return 'bg-green-100 text-green-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-indigo-100 text-indigo-700';
  };

  if (isLoading) {
    return (
      <section className="bg-white rounded-[2rem] border border-border/10 shadow-sm overflow-hidden mt-8 animate-pulse">
        <div className="px-10 py-8"><div className="h-6 bg-muted rounded w-32"></div></div>
        <div className="p-10 space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted rounded"></div>)}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-[2rem] border border-border/10 shadow-sm overflow-hidden mt-8">
      <div className="px-10 py-8 flex justify-between items-center border-b border-muted">
        <h3 className="text-xl font-serif text-primary">Recent Claims</h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Last 30 Days</span>
      </div>
      {claims.length === 0 ? (
        <div className="p-16 text-center text-secondary font-medium italic">No claims recorded yet. Stay protected!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted text-secondary text-[10px] font-bold uppercase tracking-widest">
                <th className="px-10 py-4">Date</th>
                <th className="px-10 py-4">Trigger</th>
                <th className="px-10 py-4">Amount</th>
                <th className="px-10 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {claims.map((claim, idx) => (
                <tr key={claim._id || idx} className="hover:bg-muted/30 transition-colors">
                  <td className="px-10 py-6 text-sm font-medium">{formatDate(claim.createdAt)}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-2 text-sm text-secondary">
                      <span className="material-symbols-outlined text-base">{getTriggerIcon(claim.triggerType) || 'help'}</span>
                      <span className="text-primary font-medium">{formatTriggerType(claim.triggerType)}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-sm font-bold text-primary">{formatCurrency(claim.payoutAmount)}</td>
                  <td className="px-10 py-6 text-right">
                    <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase ${getStatusStyle(claim.status)}`}>
                      {claim.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="p-8 flex justify-center border-t border-muted">
        <button className="text-sm font-bold text-secondary hover:text-primary transition-colors">Load more history</button>
      </div>
    </section>
  );
};

export default RecentClaimsTable;

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { formatCurrency, formatTriggerType } from '@/utils/formatters';

export const ClaimsProcessingTable: React.FC = () => {
  const [claims, setClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const res = await api.get('/admin/claims');
      setClaims(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch admin claims');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchClaims(); }, []);

  const handleReview = async (claimId: string, action: 'approve' | 'reject') => {
    try {
      await api.put(`/admin/claims/${claimId}/review`, { action });
      toast.success(`Claim ${action}d`);
      fetchClaims();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} claim`);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 border border-border/5 shadow-sm animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-6"></div>
        <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted rounded"></div>)}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-border/5 shadow-sm">
      <h4 className="font-serif text-2xl mb-6 text-primary italic">Claims Processing & Fraud Queue</h4>
      {claims.length === 0 ? (
        <div className="p-12 text-center text-secondary font-medium italic">No claims in the queue.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-muted">
                <th className="pb-4 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Worker Name</th>
                <th className="pb-4 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Zone</th>
                <th className="pb-4 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Trigger</th>
                <th className="pb-4 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Amount</th>
                <th className="pb-4 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Fraud Score</th>
                <th className="pb-4 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/40">
              {claims.map((claim, idx) => {
                const workerName = claim.workerId?.name || 'Worker';
                const zone = claim.disruptionEventId?.affectedZones?.[0] || 'N/A';
                const fraudScore = claim.fraudScore ?? 0;
                const canReview = claim.status === 'flagged_fraud' || claim.status === 'under_review';

                return (
                  <tr key={claim._id || idx} className="group hover:bg-muted/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-border overflow-hidden">
                          <img className="w-full h-full object-cover" src={`https://i.pravatar.cc/100?u=${workerName}`} alt={workerName} />
                        </div>
                        <span className="text-sm font-bold text-primary">{workerName}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm font-medium text-secondary">{zone}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider">{formatTriggerType(claim.triggerType)}</span>
                    </td>
                    <td className="py-4 text-sm font-serif font-bold text-primary">{formatCurrency(claim.payoutAmount)}</td>
                    <td className="py-4">
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${fraudScore > 70 ? 'bg-destructive' : fraudScore > 30 ? 'bg-amber-500' : 'bg-green-600'}`} 
                          style={{ width: `${fraudScore}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      {canReview ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleReview(claim._id, 'reject')} className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors"><span className="material-symbols-outlined text-sm">close</span></button>
                          <button onClick={() => handleReview(claim._id, 'approve')} className="p-1.5 rounded-full hover:bg-green-100 text-green-700 transition-colors"><span className="material-symbols-outlined text-sm">check</span></button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{claim.status}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClaimsProcessingTable;

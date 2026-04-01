import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/shared/StatusBadge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { AlertCircle, FileText, ArrowLeft, Download, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardHeader from '../components/landing/DashboardHeader';

const WorkerClaims = () => {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await api.get('/claims/my-claims');
        setClaims(res.data.data);
      } catch (error) {
        console.error('Failed to fetch claims');
      } finally {
        setIsLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const filteredClaims = activeFilter === 'all' ? claims : claims.filter(c => {
    if (activeFilter === 'paid') return c.status === 'paid';
    if (activeFilter === 'pending') return ['auto_approved', 'conditionally_approved', 'under_review'].includes(c.status);
    if (activeFilter === 'rejected') return c.status === 'rejected';
    return true;
  });

  const openDetail = async (id) => {
    try {
      const res = await api.get(`/claims/${id}`);
      setSelectedClaim(res.data.data);
      setIsDetailOpen(true);
    } catch (error) {
      console.error('Failed to fetch single claim details');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (isLoading) return <LoadingSpinner size="lg" className="min-h-[50vh]" />;

  return (
    <div className="min-h-screen bg-background text-primary">
      <DashboardHeader />
      
      <main className="max-w-screen-2xl mx-auto px-8 pb-20 mt-10">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <Link to="/worker/dashboard" className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary flex items-center gap-2 mb-4 hover:text-primary transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back to Dashboard
            </Link>
            <h1 className="text-6xl font-serif text-primary italic mb-4">Claim Ledger</h1>
            <p className="text-secondary max-w-xl font-medium">
              Transparent, automated payout history. Each entry represents a verified climatic or operational disruption.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => toast.success('Claims report generated. Download starting...')}
              className="p-4 rounded-full border border-border hover:bg-muted transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-border/10 overflow-hidden shadow-sm">
          <div className="p-10 border-b border-border/10 flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold italic">Recent Activity</h2>
            <div className="flex gap-2">
              {['all', 'paid', 'pending', 'rejected'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${activeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-secondary hover:text-primary'} transition-colors`}
                >
                  {f === 'all' ? 'All Events' : f}
                </button>
              ))}
            </div>
          </div>

          {filteredClaims.length === 0 ? (
            <div className="p-24 text-center space-y-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-secondary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold italic">Clear Skies</h3>
                <p className="text-secondary font-medium">No weather disruptions have triggered claims for your active policies yet.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/10">
                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Timestamp</th>
                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Disruption Event</th>
                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Intensity</th>
                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Compensation</th>
                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Status</th>
                    <th className="px-10 py-6"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaims.map(claim => (
                    <tr 
                      key={claim._id} 
                      className="border-b border-border/10 hover:bg-muted/30 cursor-pointer transition-colors group"
                      onClick={() => openDetail(claim._id)}
                    >
                      <td className="px-10 py-8 font-medium">{formatDate(claim.createdAt)}</td>
                      <td className="px-10 py-8 italic font-serif text-lg capitalize">{claim.triggerType?.replace('_', ' ')}</td>
                      <td className="px-10 py-8">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          claim.disruptionSeverity === 'extreme' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {claim.disruptionSeverity?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-10 py-8 font-bold text-xl">₹{claim.payoutAmount}</td>
                      <td className="px-10 py-8">
                        <StatusBadge status={claim.status} className="rounded-none border-b-2" />
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary group-hover:text-primary transition-colors flex items-center justify-end gap-2">
                          View Analysis <Info className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Claim Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-2xl bg-white rounded-[3rem] p-0 border-none overflow-hidden">
          {selectedClaim && (
            <div className="flex flex-col">
              <div className="p-12 bg-primary text-primary-foreground space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Verified Compensation</p>
                    <h2 className="text-6xl font-serif font-bold italic tracking-tighter">₹{selectedClaim.payoutAmount}</h2>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                    <StatusBadge status={selectedClaim.status} inverted />
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Event Date</p>
                    <p className="font-medium text-lg italic font-serif">{formatDate(selectedClaim.createdAt)}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Claim Reference</p>
                    <p className="font-mono text-sm opacity-80">#{selectedClaim._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
              </div>

              <div className="p-12 space-y-10">
                <div className="grid grid-cols-2 gap-12 text-primary">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Primary Trigger</p>
                    <p className="text-2xl font-serif font-bold italic capitalize">{selectedClaim.triggerType.replace('_', ' ')}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Verified Intensity</p>
                    <p className="text-2xl font-serif font-bold italic capitalize">{selectedClaim.disruptionSeverity?.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-muted space-y-6">
                  <h4 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Automated Policy Audit</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-border/10 pb-4">
                      <span className="text-secondary font-medium italic">Environmental Sensor Reading</span>
                      <span className="font-bold">{selectedClaim.triggerValue} {selectedClaim.disruptionEventId?.unit}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-border/10 pb-4">
                      <span className="text-secondary font-medium italic">Tier Threshold Delta</span>
                      <span className="font-bold text-green-600">+{selectedClaim.triggerValue - selectedClaim.triggerThreshold} {selectedClaim.disruptionEventId?.unit}</span>
                    </div>
                  </div>
                </div>

                {selectedClaim.status === 'flagged_fraud' && (
                  <div className="p-8 bg-red-50 border border-red-100 rounded-[2rem] flex gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-red-600 text-sm uppercase tracking-tight">Anomalous Activity Flagged</h4>
                      <p className="text-red-700/70 text-sm leading-relaxed">Our neural patterns detected a geographic mismatch during this trigger. Payout is paused for manual audit.</p>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="w-full p-5 bg-muted rounded-full font-bold uppercase tracking-widest text-[10px] text-secondary hover:bg-border transition-colors"
                >
                  Dismiss Ledger
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkerClaims;

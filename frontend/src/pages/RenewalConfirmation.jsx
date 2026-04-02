import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/services/api';
import { usePolicy } from '@/hooks/usePolicy';
import MockPaymentModal from '@/components/shared/MockPaymentModal';
import { formatCurrency, formatDate } from '@/utils/formatters';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle, RefreshCcw } from 'lucide-react';
import DashboardHeader from '@/components/landing/DashboardHeader';

const RenewalConfirmation = () => {
  const navigate = useNavigate();
  const { activePolicy, fetchActivePolicy } = usePolicy();
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePaymentSuccess = async (txDetails) => {
    setShowPayment(false);
    setLoading(true);
    try {
      await api.post('/policy/renew', {
        policyId: activePolicy?._id,
        transactionId: txDetails.transactionId
      });
      toast.success('Policy renewed successfully!');
      if (fetchActivePolicy) fetchActivePolicy();
      navigate('/worker/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Renewal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary">
      <DashboardHeader />
      
      <main className="max-w-screen-lg mx-auto px-8 pb-20 mt-10">
        <Link to="/worker/dashboard" className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary flex items-center gap-2 mb-8 hover:text-primary transition-colors">
          <ArrowLeft className="w-3 h-3" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-[3rem] p-12 border border-border/10 shadow-sm text-center space-y-8">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto border border-primary/10">
            <RefreshCcw className="w-10 h-10 text-primary" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-5xl font-serif font-bold italic text-primary">Renew Your Policy</h1>
            <p className="text-secondary font-medium max-w-md mx-auto">
              Continue your protection without any gap in coverage. Your existing triggers and zone settings will remain active.
            </p>
          </div>

          {activePolicy && (
            <div className="bg-muted p-8 rounded-[2rem] max-w-md mx-auto text-left space-y-4">
              <div className="flex justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Current Tier</span>
                <span className="font-bold capitalize">{activePolicy.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Premium</span>
                <span className="font-bold">{formatCurrency(activePolicy.weeklyPremium)}/week</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Expiry</span>
                <span className="font-bold">{formatDate(activePolicy.endDate)}</span>
              </div>
            </div>
          )}

          <button 
            onClick={() => setShowPayment(true)} 
            disabled={loading}
            className="w-full max-w-md mx-auto bg-primary text-primary-foreground p-5 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
          >
            <span>{loading ? 'Processing...' : 'Pay & Renew Now'}</span>
          </button>
        </div>
      </main>

      {showPayment && activePolicy && (
        <MockPaymentModal 
          amount={activePolicy.weeklyPremium}
          onSuccess={handlePaymentSuccess} 
          onCancel={() => setShowPayment(false)} 
        />
      )}
    </div>
  );
};

export default RenewalConfirmation;

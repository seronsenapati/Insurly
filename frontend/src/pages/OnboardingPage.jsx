import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/services/api';
import { useAuth } from '../context/AuthContext';
import MockPaymentModal from '../components/shared/MockPaymentModal';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';
import { CheckCircle, ArrowRight, ArrowLeft, ShieldCheck, Zap, Wallet } from 'lucide-react';

const ZONES = ['Patia', 'Nayapalli', 'Saheed Nagar', 'Khandagiri', 'Rasulgarh', 'Unit-4', 'Chandrasekharpur'];

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    platform: 'zomato',
    zone: 'Patia',
    pincode: '',
    avgWeeklyEarnings: '',
    workingDaysPerWeek: '',
    workingHoursPerDay: '',
    upiId: ''
  });

  const [loading, setLoading] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [quotes, setQuotes] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const nextStep = () => setCurrentStep(s => Math.min(s + 1, 6));
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));

  const handleRegister = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        zone: {
          area: formData.zone,
          pincode: formData.pincode,
          city: 'Bhubaneswar'
        }
      };
      const res = await api.post('/auth/register', payload);
      const token = res.data.data?.token || res.data.token;
      localStorage.setItem('insurly_token', token);
      const riskData = res.data.data?.riskProfile || res.data.data?.worker?.riskProfile;
      setRiskAssessment(riskData || { score: 65, explanation: 'Standard risk profile generated.' });
      nextStep();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await api.post('/policy/quote');
      setQuotes(res.data.data);
      nextStep();
    } catch (err) {
      toast.error('Failed to get quotes');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (txDetails) => {
    setShowPayment(false);
    setLoading(true);
    try {
      await api.post('/policy/purchase', {
        tier: selectedTier.tier,
        transactionId: txDetails.transactionId
      });
      nextStep();
    } catch (err) {
      toast.error('Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const StepProgress = () => (
    <div className="flex justify-center items-center space-x-2 mb-12">
      {[1, 2, 3, 4, 5, 6].map((s) => (
        <div 
          key={s} 
          className={`h-1 rounded-full transition-all duration-500 ${currentStep >= s ? 'w-8 bg-primary' : 'w-4 bg-muted'}`}
        />
      ))}
    </div>
  );

  return (
    <div className='min-h-screen bg-background font-sans flex flex-col items-center py-12 px-6'>
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Link to="/" className="text-3xl font-serif font-bold italic tracking-tight mb-2 inline-block">Insurly</Link>
          <p className="text-secondary font-bold uppercase tracking-[0.2em] text-[10px]">Secure Your Livelihood</p>
        </div>

        <StepProgress />

        <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-border/10 shadow-sm relative overflow-hidden">
          {/* Form Content */}
          <div className="relative z-10 max-w-2xl mx-auto">
            {currentStep === 1 && (
              <div className='space-y-10 animate-in fade-in slide-in-from-bottom-4'>
                <div className="space-y-2">
                  <h2 className='text-5xl font-serif font-bold text-primary italic leading-tight'>Personal details</h2>
                  <p className='text-secondary font-medium'>Let's start with your basic courier profile.</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div className="space-y-2">
                    <label className='text-[10px] font-bold text-secondary uppercase tracking-[0.2em]'>Full Name</label>
                    <input name='name' value={formData.name} onChange={handleChange} className='w-full p-4 bg-muted border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all' />
                  </div>
                  <div className="space-y-2">
                    <label className='text-[10px] font-bold text-secondary uppercase tracking-[0.2em]'>Phone</label>
                    <input name='phone' type='tel' value={formData.phone} onChange={handleChange} className='w-full p-4 bg-muted border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all' />
                  </div>
                  <div className="space-y-2">
                    <label className='text-[10px] font-bold text-secondary uppercase tracking-[0.2em]'>Email</label>
                    <input name='email' type='email' value={formData.email} onChange={handleChange} className='w-full p-4 bg-muted border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all' />
                  </div>
                  <div className="space-y-2">
                    <label className='text-[10px] font-bold text-secondary uppercase tracking-[0.2em]'>Password</label>
                    <input name='password' type='password' value={formData.password} onChange={handleChange} className='w-full p-4 bg-muted border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all' />
                  </div>
                </div>
                <button 
                  onClick={nextStep}
                  className='w-full bg-primary text-primary-foreground p-5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all'
                >
                  <span>Continue to Work Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className='space-y-10 animate-in fade-in slide-in-from-bottom-4'>
                <div className="space-y-2">
                  <h2 className='text-5xl font-serif font-bold text-primary italic leading-tight'>Work & Earnings</h2>
                  <p className='text-secondary font-medium'>We calculate risk based on your activity patterns.</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div className="space-y-2">
                    <label className='text-[10px] font-bold text-secondary uppercase tracking-[0.2em]'>Platform</label>
                    <select name='platform' value={formData.platform} onChange={handleChange} className='w-full p-4 bg-muted border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none appearance-none'>
                      <option value='zomato'>Zomato</option>
                      <option value='swiggy'>Swiggy</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className='text-[10px] font-bold text-secondary uppercase tracking-[0.2em]'>Primary Zone</label>
                    <select name='zone' value={formData.zone} onChange={handleChange} className='w-full p-4 bg-muted border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none appearance-none'>
                      {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className='text-[10px] font-bold text-secondary uppercase tracking-[0.2em]'>Pincode</label>
                    <input name='pincode' value={formData.pincode} onChange={handleChange} className='w-full p-4 bg-muted border-none rounded-2xl' />
                  </div>
                  <div className="space-y-2">
                    <label className='text-[10px] font-bold text-secondary uppercase tracking-[0.2em]'>Weekly Earnings (Est.)</label>
                    <input name='avgWeeklyEarnings' type='number' value={formData.avgWeeklyEarnings} onChange={handleChange} className='w-full p-4 bg-muted border-none rounded-2xl' />
                  </div>
                </div>
                <div className='flex gap-4'>
                  <button onClick={prevStep} className='flex-1 border border-border text-secondary p-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-muted transition-all'>Back</button>
                  <button onClick={nextStep} className='flex-[2] bg-primary text-primary-foreground p-5 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all'>
                    <span>Assessment Phase</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className='space-y-10 animate-in fade-in slide-in-from-bottom-4'>
                <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wallet className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className='text-5xl font-serif font-bold text-primary italic leading-tight'>Payout Setup</h2>
                  <p className='text-secondary font-medium'>Immediate, automated triggers to your account.</p>
                </div>
                <div className="space-y-2">
                  <label className='text-[10px] font-bold text-secondary uppercase tracking-[0.2em] text-center block'>Your UPI ID</label>
                  <input name='upiId' placeholder='name@bank' value={formData.upiId} onChange={handleChange} className='w-full p-6 bg-muted border-none rounded-[2rem] text-3xl text-center font-bold tracking-tight text-primary outline-none focus:ring-2 focus:ring-primary/10' />
                </div>
                <div className='flex gap-4'>
                  <button onClick={prevStep} className='flex-1 border border-border text-secondary p-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-muted transition-all'>Back</button>
                  <button onClick={handleRegister} disabled={loading} className='flex-[2] bg-primary text-primary-foreground p-5 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all'>
                    {loading ? 'Evaluating Risk...' : 'Analyze My Risk'}
                    {!loading && <Zap className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className='space-y-10 text-center animate-in fade-in zoom-in-95 duration-700'>
                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto border border-primary/10 relative">
                  <ShieldCheck className="w-12 h-12 text-primary" />
                  <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping opacity-20" />
                </div>
                <div className="space-y-4">
                  <h2 className='text-5xl font-serif font-bold text-primary italic'>Risk Profile Analyzed</h2>
                  <p className='text-secondary font-medium uppercase tracking-[0.2em] text-[10px]'>Editorial Verification Complete</p>
                </div>
                <div className='bg-muted p-10 rounded-[3rem] text-left border border-border/10'>
                  <div className='flex justify-between items-center mb-6'>
                    <span className='text-[10px] font-bold uppercase tracking-[0.2em] text-secondary'>Curated Score</span>
                    <span className='text-4xl font-serif italic font-bold text-primary'>{riskAssessment?.score || '65'}<span className="text-secondary text-sm font-sans not-italic font-medium">/100</span></span>
                  </div>
                  <p className='text-primary font-medium leading-relaxed italic'>
                    "{riskAssessment?.explanation || 'Based on your zone, earnings history, and historical weather patterns, we have generated bespoke coverage for your profile.'}"
                  </p>
                </div>
                <button onClick={fetchQuotes} disabled={loading} className='w-full bg-primary text-primary-foreground p-5 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all'>
                  {loading ? 'Generating Quotes...' : 'View My Curated Tiers'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            )}

            {currentStep === 5 && (
              <div className='space-y-10 animate-in fade-in slide-in-from-bottom-4'>
                <h2 className='text-5xl font-serif font-bold text-primary italic leading-tight text-center'>Select Coverage</h2>
                <div className='grid gap-6'>
                  {quotes ? quotes.map((tier, idx) => (
                    <div 
                      key={tier.tier || idx}
                      onClick={() => setSelectedTier(tier)}
                      className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all flex justify-between items-center group ${
                        selectedTier?.tier === tier.tier ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/30'
                      }`}
                    >
                      <div>
                        <span className='text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-1 block'>{tier.tier} Coverage</span>
                        <p className='text-2xl font-serif italic font-bold text-primary group-hover:translate-x-1 transition-transform'>{formatCurrency(tier.maxCoverage)} Total Protection</p>
                        <p className='text-[10px] text-secondary font-bold uppercase tracking-widest mt-2'>₹{tier.dailyPayout} Daily Payout on Trigger</p>
                      </div>
                      <div className='text-right'>
                        <span className='text-3xl font-bold text-primary'>{formatCurrency(tier.premium)}</span>
                        <span className='text-[10px] font-bold text-secondary uppercase tracking-widest block'>/WEEK</span>
                      </div>
                    </div>
                  )) : <div className='text-center py-4'>No quotes available.</div>}
                </div>
                <button 
                  onClick={() => setShowPayment(true)} 
                  disabled={!selectedTier} 
                  className='w-full bg-primary text-primary-foreground p-6 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50'
                >
                  <span>Proceed to Final Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {currentStep === 6 && (
              <div className='text-center py-10 space-y-10 animate-in fade-in zoom-in-95 duration-1000'>
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100">
                  <CheckCircle className='w-12 h-12 text-green-600' />
                </div>
                <div className="space-y-4">
                  <h2 className='text-5xl font-serif font-bold text-primary italic'>You're Protected</h2>
                  <p className='text-secondary font-bold uppercase tracking-[0.2em] text-[10px]'>Policy Issued & Secure</p>
                </div>
                <p className='text-primary font-medium leading-relaxed max-w-md mx-auto italic'>
                  Your policy is active. Payouts are now 100% automated straight to <b className='text-primary not-italic'>{formData.upiId}</b> during weather disruptions.
                </p>
                <button onClick={() => navigate('/worker/dashboard')} className='w-full bg-primary text-primary-foreground p-6 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all'>
                  <span>Navigate to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-muted/30 rounded-full -translate-y-1/2 translate-x-1/2 -z-0" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-muted/20 rounded-full translate-y-1/2 -translate-x-1/2 -z-0" />
        </div>
      </div>
      
      {showPayment && selectedTier && (
        <MockPaymentModal 
          amount={selectedTier.premium} 
          onSuccess={handlePaymentSuccess} 
          onCancel={() => setShowPayment(false)} 
        />
      )}
    </div>
  );
};

export default OnboardingPage;

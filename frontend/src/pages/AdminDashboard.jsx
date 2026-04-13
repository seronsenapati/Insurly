import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

import AdminTopBar from '../components/landing/AdminTopBar';
import AdminStatsGrid from '../components/landing/AdminStatsGrid';
import ManualTriggerPanel from '../components/landing/ManualTriggerPanel';
import LiveDisruptionFeed from '../components/landing/LiveDisruptionFeed';
import ZoneRiskHeatmap from '../components/landing/ZoneRiskHeatmap';
import ClaimsProcessingTable from '../components/landing/ClaimsProcessingTable';
import LossRatioChart from '../components/landing/LossRatioChart';
import PredictiveAnalyticsPanel from '../components/landing/PredictiveAnalyticsPanel';

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Manual Trigger State
  const [triggerType, setTriggerType] = useState('heavy_rain');
  const [triggerReading, setTriggerReading] = useState('');
  const [isFiringTrigger, setIsFiringTrigger] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const overviewRes = await api.get('/analytics/admin/overview');
      setOverview(overviewRes.data.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
      // Fallback to mock data handled by components if API fails
    } finally {
      setIsLoading(false);
    }
  };

  const handleFireManualTrigger = async (e, selectedZones = []) => {
    e.preventDefault();
    if (!triggerReading) return toast.error('Reading is required');

    try {
      setIsFiringTrigger(true);
      const res = await api.post('/triggers/manual', {
        type: triggerType,
        reading: Number(triggerReading),
        zones: selectedZones
      });
      
      toast.success(res.data.message);
      setTriggerReading('');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fire trigger');
    } finally {
      setIsFiringTrigger(false);
    }
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center bg-background min-h-screen"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="flex bg-background min-h-screen text-primary overflow-x-hidden">
      <div className="flex-1">
        <AdminTopBar />
        
        <main className="pt-32 p-10 space-y-10 max-w-[1600px] mx-auto">
          {/* Stats Row */}
          <AdminStatsGrid overview={overview} />

          {/* Two Column Layout for Interactive Panels */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            {/* Left Column: Triggers & Feed */}
            <div className="xl:col-span-4 space-y-10">
              <ManualTriggerPanel 
                onFire={handleFireManualTrigger}
                type={triggerType}
                setType={setTriggerType}
                reading={triggerReading}
                setReading={setTriggerReading}
                isFiring={isFiringTrigger}
              />
              <LiveDisruptionFeed />
            </div>

            {/* Right Column: Heatmap */}
            <div id="zone-map" className="xl:col-span-8">
              <ZoneRiskHeatmap />
            </div>
          </div>

          {/* Bottom Row: Claims & Analytics */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            <div id="claims" className="xl:col-span-8 space-y-10">
              <ClaimsProcessingTable />
            </div>
            <div className="xl:col-span-4 space-y-10">
              <LossRatioChart />
              <PredictiveAnalyticsPanel />
            </div>
          </div>

          {/* Footer Branding */}
          <footer className="pt-12 pb-6 border-t border-border/5 flex justify-between items-center text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
            <p>&copy; 2026 INSURLY OVERSIGHT SYSTEMS. ALL PROTOCOLS SECURED.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="hover:text-primary transition-colors">API Status</a>
              <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

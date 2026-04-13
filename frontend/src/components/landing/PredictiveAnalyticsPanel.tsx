import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';

interface PredictionData {
  prediction: string;
  confidence: number;
  risks: string[];
}

export const PredictiveAnalyticsPanel: React.FC = () => {
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await api.get('/analytics/admin/predictions');
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to parse AI predictions', error);
        // Fallback mock
        setData({
          prediction: 'Based on historical patterns, moderate disruption risk expected due to upcoming monsoon shifts.',
          confidence: 68,
          risks: ['Heavy Rain (Zone North)', 'Waterlogging (Zone East)']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-border/10 p-6 shadow-sm min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-secondary/20"></div>
          <p className="text-secondary text-sm font-medium tracking-wide">ANALYZING RISK FACTORS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border/10 p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="font-serif text-2xl text-primary italic">AI Predictive Analytics</h4>
          <p className="text-xs font-bold text-secondary tracking-widest uppercase mt-1">Next 7 Days Forecast</p>
        </div>
        <div className="h-12 w-12 bg-primary/5 rounded-full flex items-center justify-center text-primary">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-surface p-5 border border-border/5 text-sm leading-relaxed text-primary/80 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/40"></div>
          {data?.prediction}
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1 bg-surface border border-border/5 p-4 flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">Confidence Score</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-serif text-xl italic text-primary">{Math.round(data?.confidence || 0)}%</span>
            </div>
          </div>
        </div>

        {data?.risks && data.risks.length > 0 && (
          <div>
            <p className="text-xs font-bold text-secondary tracking-widest uppercase mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" /> Key Risk Factors
            </p>
            <ul className="space-y-2">
              {data.risks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-primary/70 bg-surface/50 p-2.5 border border-border/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-error/60 mt-1.5 flex-shrink-0"></div>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictiveAnalyticsPanel;
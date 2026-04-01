import React, { useState, useEffect } from 'react';
import api from '@/services/api';

export const AlertBanner: React.FC = () => {
  const [activeDisruption, setActiveDisruption] = useState<any>(null);
  const dismissedIdsRef = React.useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchActiveDisruptions = async () => {
      try {
        const res = await api.get('/triggers/active');
        const events = res.data.data;
        if (events && events.length > 0) {
          const latestEvent = events[0];
          // Only show if we haven't dismissed this specific event
          if (!dismissedIdsRef.current.has(latestEvent._id)) {
            setActiveDisruption(latestEvent);
          }
        } else {
          setActiveDisruption(null);
        }
      } catch (error) {
        // No active disruptions or API not available
      }
    };
    fetchActiveDisruptions();
    const interval = setInterval(fetchActiveDisruptions, 10000);
    return () => clearInterval(interval);
  }, []);
  
  if (!activeDisruption) return null;

  const typeFormatted = activeDisruption.type ? activeDisruption.type.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Disruption';
  const zone = activeDisruption.affectedZones?.[0] || 'your zone';

  return (
    <section className="mb-10">
      <div className="bg-red-50 border-l-4 border-destructive text-primary rounded-xl px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="material-symbols-outlined text-destructive" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          <p className="font-medium">Alert: {typeFormatted} detected in {zone}. Your claim is being processed automatically.</p>
        </div>
        <button 
          onClick={() => {
            if (activeDisruption && activeDisruption._id) {
              dismissedIdsRef.current.add(activeDisruption._id);
            }
            setActiveDisruption(null);
          }} 
          className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors"
        >Dismiss</button>
      </div>
    </section>
  );
};

export default AlertBanner;

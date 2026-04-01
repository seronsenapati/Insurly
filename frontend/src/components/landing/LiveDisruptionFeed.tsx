import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { formatTriggerType } from '@/utils/formatters';

const TRIGGER_ICONS: Record<string, { icon: string; color: string }> = {
  heavy_rain: { icon: 'rainy', color: 'blue' },
  extreme_heat: { icon: 'thermostat', color: 'amber' },
  cyclone_storm: { icon: 'air', color: 'slate' },
  severe_pollution: { icon: 'air', color: 'teal' },
  zone_lockdown: { icon: 'lock', color: 'red' }
};

export const LiveDisruptionFeed: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/triggers/active');
        setEvents(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch active disruptions');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-white rounded-[2rem] p-8 border border-border/5 shadow-sm animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-6"></div>
        <div className="space-y-6">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted rounded"></div>)}</div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-[2rem] p-8 border border-border/5 shadow-sm">
      <h4 className="font-serif text-2xl mb-6 text-primary italic">Live Disruption Feed</h4>
      {events.length === 0 ? (
        <div className="text-center py-8 text-secondary font-medium italic">No active disruptions. All clear.</div>
      ) : (
        <div className="space-y-6">
          {events.map((item: any, idx: number) => {
            const triggerInfo = TRIGGER_ICONS[item.type] || { icon: 'warning', color: 'amber' };
            const timeAgo = item.createdAt ? new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';
            return (
              <div key={item._id || idx} className="flex gap-4 items-start group">
                <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border/5 text-${triggerInfo.color}-600`}>
                  <span className="material-symbols-outlined text-lg">{triggerInfo.icon}</span>
                </div>
                <div className={`flex-1 ${idx !== events.length - 1 ? 'border-b border-muted pb-4' : ''}`}>
                  <p className="text-sm font-bold text-primary">{formatTriggerType(item.type)} in {item.affectedZones?.join(', ') || 'Multiple Zones'}</p>
                  <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">Value: {item.reading ?? item.value ?? 'N/A'} • {timeAgo}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default LiveDisruptionFeed;

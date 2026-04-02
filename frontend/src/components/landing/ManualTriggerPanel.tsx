import React, { useState } from 'react';

const ZONES = ['Patia', 'Nayapalli', 'Saheed Nagar', 'Khandagiri', 'Rasulgarh', 'Unit-4', 'Chandrasekharpur'];

interface ManualTriggerPanelProps {
  readonly onFire: (e: React.FormEvent, selectedZones: string[]) => void;
  readonly type: string;
  readonly setType: (t: string) => void;
  readonly reading: string;
  readonly setReading: (r: string) => void;
  readonly isFiring: boolean;
}

export const ManualTriggerPanel: React.FC<ManualTriggerPanelProps> = ({ onFire, type, setType, reading, setReading, isFiring }) => {
  const [selectedZones, setSelectedZones] = useState<string[]>(['Patia']);

  const toggleZone = (zone: string) => {
    setSelectedZones(prev => 
      prev.includes(zone) ? prev.filter(z => z !== zone) : [...prev, zone]
    );
  };

  return (
    <section className="bg-muted rounded-[2rem] p-8 border border-border/10">
      <h4 className="font-serif text-2xl mb-6 text-primary italic">Manual Trigger Panel</h4>
      <form onSubmit={(e) => onFire(e, selectedZones)} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2">Select Trigger Type</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-white border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 text-sm font-medium outline-none shadow-sm"
          >
            <option value="heavy_rain">Heavy Rain (mm/hr)</option>
            <option value="extreme_heat">Extreme Heat (°C)</option>
            <option value="cyclone_storm">Cyclone Storm (km/h)</option>
            <option value="severe_pollution">Severe Pollution (AQI)</option>
            <option value="zone_lockdown">Zone Lockdown</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2">Value Input</label>
          <input 
            type="number"
            value={reading}
            onChange={(e) => setReading(e.target.value)}
            placeholder="e.g. 50.0"
            className="w-full bg-white border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 text-sm font-medium outline-none shadow-sm"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4">Affected Zones</label>
          <div className="grid grid-cols-2 gap-3">
            {ZONES.map(zone => (
              <label key={zone} className="flex items-center gap-3 bg-white/50 p-3 rounded-xl cursor-pointer hover:bg-white transition-all shadow-sm border border-transparent hover:border-border/10">
                <input 
                  checked={selectedZones.includes(zone)} 
                  onChange={() => toggleZone(zone)} 
                  type="checkbox" 
                  className="rounded-full border-muted text-primary focus:ring-0" 
                />
                <span className="text-xs font-bold text-secondary uppercase tracking-widest">{zone}</span>
              </label>
            ))}
          </div>
        </div>
        <button 
          type="submit"
          disabled={isFiring}
          className="w-full bg-primary text-primary-foreground rounded-full py-4 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
        >
          <span>{isFiring ? 'Firing...' : 'Fire Trigger Event'}</span>
          <span className="material-symbols-outlined text-sm">bolt</span>
        </button>
      </form>
    </section>
  );
};

export default ManualTriggerPanel;

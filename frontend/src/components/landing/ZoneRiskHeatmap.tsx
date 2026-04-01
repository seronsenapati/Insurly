import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ZONE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Patia":            { lat: 20.330, lng: 85.835 },
  "Nayapalli":        { lat: 20.300, lng: 85.820 },
  "Saheed Nagar":     { lat: 20.285, lng: 85.850 },
  "Khandagiri":       { lat: 20.260, lng: 85.790 },
  "Rasulgarh":        { lat: 20.300, lng: 85.860 },
  "Unit-4":           { lat: 20.265, lng: 85.845 },
  "Chandrasekharpur": { lat: 20.325, lng: 85.795 }
};

export const ZoneRiskHeatmap: React.FC = () => {
  const [zones, setZones] = useState<any[]>([]);

  useEffect(() => {
    const fetchZoneRisk = async () => {
      try {
        const res = await api.get('/analytics/admin/zone-risk');
        setZones(res.data.data || []);
      } catch (error) {
        // Fallback to static display
      }
    };
    fetchZoneRisk();
  }, []);

  const getRiskLevel = (score: number) => {
    if (score > 70) return { label: 'Critical', color: '#ef4444' };
    if (score > 40) return { label: 'Elevated', color: '#f59e0b' };
    return { label: 'Safe', color: '#22c55e' };
  };

  const getRiskScore = (zoneName: string) => {
    const zone = zones.find(z => z.name === zoneName);
    return zone ? (zone.riskScore ?? 50) : 50;
  };

  return (
    <div id="zone-map" className="bg-white rounded-[2rem] p-8 border border-border/5 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-serif text-2xl text-primary italic">Zone Risk Heatmap</h4>
        <div className="flex gap-2 bg-muted p-1 rounded-full">
          <button className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">24h</button>
          <button className="px-4 py-1.5 rounded-full bg-white shadow-sm text-[10px] font-bold uppercase tracking-widest text-primary">Real-time</button>
        </div>
      </div>
      <div className="relative flex-1 rounded-3xl overflow-hidden bg-muted border border-border/5 min-h-[400px]">
        <MapContainer
          center={[20.296, 85.824]}
          zoom={12}
          style={{ height: "100%", width: "100%", minHeight: "400px", zIndex: 0 }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
          />
          {Object.entries(ZONE_COORDINATES).map(([zoneName, coords]) => {
            const riskScore = getRiskScore(zoneName);
            const risk = getRiskLevel(riskScore);
            return (
              <CircleMarker
                key={zoneName}
                center={[coords.lat, coords.lng]}
                radius={riskScore > 70 ? 24 : riskScore > 40 ? 16 : 10}
                pathOptions={{
                  color: risk.color,
                  fillColor: risk.color,
                  fillOpacity: 0.6,
                  weight: 2
                }}
              >
                <Tooltip>
                  <div className="text-sm">
                    <p className="font-bold uppercase tracking-widest">{zoneName}</p>
                    <p>Risk Score: {riskScore}</p>
                    <p>Status: {risk.label}</p>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
      <div className="mt-6 flex gap-8 items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive"></div>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Safe</span>
        </div>
      </div>
    </div>
  );
};

export default ZoneRiskHeatmap;

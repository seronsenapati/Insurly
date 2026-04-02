import React from "react";
import { MapContainer, TileLayer, Circle, Tooltip, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ZONE_COORDINATES = {
  "Patia":            { lat: 20.330, lng: 85.835, defaultRisk: 0.75 },
  "Nayapalli":        { lat: 20.300, lng: 85.820, defaultRisk: 0.65 },
  "Saheed Nagar":     { lat: 20.285, lng: 85.850, defaultRisk: 0.60 },
  "Khandagiri":       { lat: 20.260, lng: 85.790, defaultRisk: 0.55 },
  "Rasulgarh":        { lat: 20.300, lng: 85.860, defaultRisk: 0.70 },
  "Unit-4":           { lat: 20.265, lng: 85.845, defaultRisk: 0.50 },
  "Chandrasekharpur": { lat: 20.325, lng: 85.795, defaultRisk: 0.45 }
};

const getRiskColor = (risk) => {
  if (risk >= 0.7) return "#ef4444";
  if (risk >= 0.55) return "#f97316";
  return "#22c55e";
};

const getRiskLabel = (risk) => {
  if (risk >= 0.7) return "High Risk";
  if (risk >= 0.55) return "Medium Risk";
  return "Low Risk";
};

const ZoneRiskHeatmap = ({ zoneData = [] }) => {
  const getZoneRisk = (zoneName) => {
    const apiZone = zoneData.find(z => (z.name || z.area) === zoneName);
    return apiZone ? (apiZone.riskScore ?? apiZone.risk ?? ZONE_COORDINATES[zoneName]?.defaultRisk ?? 0.5) : (ZONE_COORDINATES[zoneName]?.defaultRisk ?? 0.5);
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-200">
      <MapContainer
        center={[20.296, 85.824]}
        zoom={12}
        style={{ height: "400px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {Object.entries(ZONE_COORDINATES).map(([zoneName, coords]) => {
          const risk = getZoneRisk(zoneName);
          const color = getRiskColor(risk);
          const label = getRiskLabel(risk);
          return (
            <Circle
              key={zoneName}
              center={[coords.lat, coords.lng]}
              radius={1500}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.4,
                weight: 2
              }}
            >
              <Tooltip permanent direction="center" className="font-semibold text-xs">
                {zoneName}
              </Tooltip>
              <Popup>
                <div className="text-sm">
                  <p className="font-bold text-gray-800">{zoneName}</p>
                  <p style={{ color: color }} className="font-semibold">{label}</p>
                  <p className="text-gray-600">Risk Score: {(risk * 100).toFixed(0)}%</p>
                </div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
      <div className="flex gap-4 p-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs text-gray-600">High Risk</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span className="text-xs text-gray-600">Medium Risk</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs text-gray-600">Low Risk</span></div>
      </div>
    </div>
  );
};

export default ZoneRiskHeatmap;

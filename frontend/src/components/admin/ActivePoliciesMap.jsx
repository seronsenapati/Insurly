import React from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ZONE_COORDINATES = {
  "Patia":            { lat: 20.330, lng: 85.835 },
  "Nayapalli":        { lat: 20.300, lng: 85.820 },
  "Saheed Nagar":     { lat: 20.285, lng: 85.850 },
  "Khandagiri":       { lat: 20.260, lng: 85.790 },
  "Rasulgarh":        { lat: 20.300, lng: 85.860 },
  "Unit-4":           { lat: 20.265, lng: 85.845 },
  "Chandrasekharpur": { lat: 20.325, lng: 85.795 }
};

const ActivePoliciesMap = ({ activePolicies = [] }) => {
  const getZonePolicyCount = (zoneName) => {
    return activePolicies.filter(p => p.workerZone === zoneName).length;
  };

  const getMarkerSize = (count) => {
    if (count === 0) return 8;
    if (count <= 2) return 12;
    if (count <= 5) return 18;
    return 24;
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-200">
      <MapContainer
        center={[20.296, 85.824]}
        zoom={12}
        style={{ height: "350px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {Object.entries(ZONE_COORDINATES).map(([zoneName, coords]) => {
          const count = getZonePolicyCount(zoneName);
          return (
            <CircleMarker
              key={zoneName}
              center={[coords.lat, coords.lng]}
              radius={getMarkerSize(count)}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: count > 0 ? 0.6 : 0.2,
                weight: 2
              }}
            >
              <Tooltip>
                <div className="text-sm">
                  <p className="font-bold">{zoneName}</p>
                  <p>{count} active {count === 1 ? "policy" : "policies"}</p>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ActivePoliciesMap;

"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon asset issue in Next.js
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], 12);
    }
  }, [lat, lon, map]);
  return null;
}

interface MapProps {
  centerLat: number;
  centerLon: number;
  villageName: string;
  district: string;
  mandal?: string;
  nearbyVillages?: any[];
  radiusKm?: number;
}

export default function TelanganaMap({
  centerLat,
  centerLon,
  villageName,
  district,
  mandal,
  nearbyVillages = [],
  radiusKm = 5.0,
}: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-slate-100 rounded-2xl text-xs text-slate-500">
        Initializing Telangana GIS Map Layer...
      </div>
    );
  }

  return (
    <MapContainer
      center={[centerLat, centerLon]}
      zoom={11}
      scrollWheelZoom={true}
      className="w-full h-full min-h-[500px] rounded-2xl shadow-inner z-10"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap lat={centerLat} lon={centerLon} />

      {/* Center Village Marker */}
      <Marker position={[centerLat, centerLon]} icon={customIcon}>
        <Popup>
          <div className="p-1 text-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-0.5">{villageName}</h4>
            <p className="text-slate-600 mb-1">
              Mandal: <b>{mandal || "Local"}</b> • District: <b>{district}</b>
            </p>
            <p className="text-slate-500 text-[10px]">
              Coordinates: {centerLat.toFixed(4)}°N, {centerLon.toFixed(4)}°E
            </p>
          </div>
        </Popup>
      </Marker>

      {/* Radius Circle (e.g. 5 km or 10 km) */}
      {radiusKm > 0 && (
        <Circle
          center={[centerLat, centerLon]}
          radius={radiusKm * 1000}
          pathOptions={{
            color: "#059669",
            fillColor: "#10b981",
            fillOpacity: 0.12,
            weight: 2,
            dashArray: "4 6",
          }}
        />
      )}

      {/* Nearby Village Markers */}
      {nearbyVillages.map((v, idx) => (
        <Marker
          key={v.id || idx}
          position={[v.latitude, v.longitude]}
          icon={customIcon}
        >
          <Popup>
            <div className="p-1 text-xs">
              <span className="font-bold text-slate-900 block">{v.village_name}</span>
              <span className="text-slate-500 text-[10px] block">
                {v.distance_km ? `${v.distance_km} km away • ` : ""}Mandal: {v.mandal}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

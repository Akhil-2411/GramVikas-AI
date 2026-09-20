"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  MapPin,
  Search,
  Compass,
  Radar,
  Building2,
  Users,
  Layers,
  ArrowRight
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getDistricts, getMandals, getVillages, getRadiusAnalysis } from "@/lib/api";

// Dynamically import map without SSR to avoid Leaflet window error
const TelanganaMap = dynamic(() => import("@/components/map/TelanganaMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[550px] flex items-center justify-center bg-slate-100 rounded-2xl text-xs text-slate-500">
      Loading Telangana GIS Map...
    </div>
  ),
});

export default function VillageMapPage() {
  const { district, setDistrict, mandal, setMandal, village, setVillage } = useAppStore();

  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [mandalsList, setMandalsList] = useState<string[]>([]);
  const [villagesList, setVillagesList] = useState<any[]>([]);
  const [centerLat, setCenterLat] = useState<number>(19.694); // Default Adilabad GPS
  const [centerLon, setCenterLon] = useState<number>(78.4245);
  const [nearbyVillages, setNearbyVillages] = useState<any[]>([]);
  const [radiusKm, setRadiusKm] = useState<number>(5.0);
  const [searchQuery, setSearchQuery] = useState("");

  // Load districts
  useEffect(() => {
    getDistricts().then((d) => Array.isArray(d) && setDistrictsList(d)).catch(console.warn);
  }, []);

  // Load mandals
  useEffect(() => {
    if (district) {
      getMandals(district).then((m) => Array.isArray(m) && setMandalsList(m)).catch(console.warn);
    }
  }, [district]);

  // Load villages and update center coords
  useEffect(() => {
    if (district) {
      getVillages(district, mandal).then((vills) => {
        if (Array.isArray(vills) && vills.length > 0) {
          setVillagesList(vills);
          const matched = village ? vills.find((v) => v.village_name === village) : vills[0];
          const target = matched || vills[0];
          setCenterLat(target.latitude);
          setCenterLon(target.longitude);
          if (!village) setVillage(target.village_name);
        }
      }).catch(console.warn);
    }
  }, [district, mandal, village]);

  // Load radius neighbor habitations
  useEffect(() => {
    if (district && village) {
      getRadiusAnalysis(district, village, radiusKm).then((res) => {
        if (res && Array.isArray(res.nearby_villages)) {
          setNearbyVillages(res.nearby_villages);
        }
      }).catch(console.warn);
    }
  }, [district, village, radiusKm]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1.5">
            <MapPin className="w-3 h-3 text-emerald-600" /> Module 5: Village Intelligence GIS
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Telangana Village Intelligence Map
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive OpenStreetMap layer with 10,455 census village centroids and PostGIS metric radius trade zones.
          </p>
        </div>

        <Link
          href="/dashboard/radius"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
        >
          <Radar className="w-4 h-4" /> Open Full Radius Analytics <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Map Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-900 block pb-2 border-b border-slate-100">
              Navigation & Geographic Filters
            </span>

            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District (33)</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 font-bold outline-none"
              >
                {districtsList.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Mandal */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mandal / Sub-District</label>
              <select
                value={mandal}
                onChange={(e) => setMandal(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 font-medium outline-none"
              >
                <option value="">All Mandals</option>
                {mandalsList.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Village */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Village</label>
              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 font-bold text-emerald-800 outline-none"
              >
                {villagesList.map((v) => (
                  <option key={v.id} value={v.village_name}>{v.village_name}</option>
                ))}
              </select>
            </div>

            {/* Radius Size Selector */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Radius Trade Zone:</span>
                <span className="text-emerald-700 font-bold">{radiusKm} KM</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 20].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadiusKm(r)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                      radiusKm === r
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {r} KM
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Village Stat Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Inspected Village</span>
              <h3 className="font-extrabold text-base text-slate-900">{village || "Selected Village"}</h3>
              <p className="text-xs text-slate-600">
                Mandal: <b>{mandal || "Local"}</b> • District: <b>{district}</b>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">GPS Coordinates</span>
                <span className="font-bold text-slate-800 text-[11px]">
                  {centerLat.toFixed(4)}°, {centerLon.toFixed(4)}°
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Nearby Villages ({radiusKm}km)</span>
                <span className="font-bold text-emerald-800 text-sm">
                  {nearbyVillages.length} Villages
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Map Canvas */}
        <div className="lg:col-span-8 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm min-h-[560px]">
          <TelanganaMap
            centerLat={centerLat}
            centerLon={centerLon}
            villageName={village || "Target Village"}
            district={district}
            mandal={mandal}
            nearbyVillages={nearbyVillages}
            radiusKm={radiusKm}
          />
        </div>
      </div>
    </div>
  );
}

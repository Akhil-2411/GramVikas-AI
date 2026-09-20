"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Radar,
  MapPin,
  Users,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Download
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getDistricts, getVillages, getRadiusAnalysis, getReportDownloadUrl } from "@/lib/api";

const TelanganaMap = dynamic(() => import("@/components/map/TelanganaMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-100 rounded-2xl text-xs text-slate-500">
      Loading Metric Radius GIS Layer...
    </div>
  ),
});

export default function RadiusAnalysisPage() {
  const { district, setDistrict, village, setVillage, marginCapital, businessCategory } = useAppStore();
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [villagesList, setVillagesList] = useState<any[]>([]);
  const [radiusKm, setRadiusKm] = useState<number>(10.0);
  const [radiusData, setRadiusData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDistricts().then((d) => Array.isArray(d) && setDistrictsList(d)).catch(console.warn);
  }, []);

  useEffect(() => {
    if (district) {
      getVillages(district).then((vills) => {
        if (Array.isArray(vills) && vills.length > 0) {
          setVillagesList(vills);
          if (!village) setVillage(vills[0].village_name);
        }
      }).catch(console.warn);
    }
  }, [district]);

  useEffect(() => {
    if (district && village) {
      setLoading(true);
      getRadiusAnalysis(district, village, radiusKm)
        .then(setRadiusData)
        .catch(console.warn)
        .finally(() => setLoading(false));
    }
  }, [district, village, radiusKm]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold mb-1.5">
            <Radar className="w-3 h-3 text-purple-600" /> Module 6: PostGIS Metric Radius Analysis
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Radius Trade Corridor & Population Reach
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate reachable customer demographics and discover commercial hubs within 5 km, 10 km, and 20 km.
          </p>
        </div>

        <a
          href={getReportDownloadUrl(district, village, businessCategory, marginCapital)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
        >
          <Download className="w-4 h-4" /> Download Radius Report
        </a>
      </div>

      {/* Control Strip */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 font-bold outline-none"
            >
              {districtsList.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Center Village</label>
            <select
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 font-bold text-emerald-800 outline-none min-w-[160px]"
            >
              {villagesList.map((v) => (
                <option key={v.id} value={v.village_name}>{v.village_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Radius Radio Pill Buttons */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 text-right">Selected Proximity Zone</label>
          <div className="flex items-center gap-2">
            {[5, 10, 20].map((r) => (
              <button
                key={r}
                onClick={() => setRadiusKm(r)}
                className={`px-4 py-2 rounded-xl text-xs font-black border transition ${
                  radiusKm === r
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {r} KM Radius
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      {radiusData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Reachable Consumers</span>
            <span className="text-2xl font-black text-slate-900">
              {radiusData.estimated_consumer_reach?.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-1">
              ~2,850 citizens per revenue village
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Neighbor Villages</span>
            <span className="text-2xl font-black text-emerald-700">
              {radiusData.nearby_villages_count} Habitats
            </span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-1">
              Within {radiusKm} km boundary
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Estimated MSMEs</span>
            <span className="text-2xl font-black text-blue-700">
              {radiusData.nearby_enterprises_count} Units
            </span>
            <span className="text-[11px] text-blue-600 font-medium block mt-1">
              Density: {radiusData.business_density}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Market Saturation</span>
            <span className="text-sm font-black text-purple-800 leading-tight block">
              {radiusData.competition_density}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              High Growth Opportunity
            </span>
          </div>
        </div>
      )}

      {/* Map + Nearby Villages Table Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm min-h-[460px]">
          {radiusData && (
            <TelanganaMap
              centerLat={radiusData.center_lat}
              centerLon={radiusData.center_lon}
              villageName={radiusData.center_village}
              district={radiusData.center_district}
              nearbyVillages={radiusData.nearby_villages}
              radiusKm={radiusKm}
            />
          )}
        </div>

        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              Reachable Villages ({radiusData?.nearby_villages?.length || 0})
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Sorted by exact Euclidean distance in meters from {village}
            </p>

            <div className="overflow-y-auto max-h-[350px] space-y-2 pr-1">
              {radiusData?.nearby_villages?.map((v: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{v.village_name}</span>
                    <span className="text-[10px] text-slate-500 block">Mandal: {v.mandal}</span>
                  </div>
                  <span className="font-extrabold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                    {v.distance_km} km
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500">
              Corridor reach covers ~{(radiusData?.nearby_villages_count || 0) * 2850} citizens for local micro-distribution.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

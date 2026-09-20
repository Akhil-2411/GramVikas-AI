"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getMarketGap, getDistricts } from "@/lib/api";

export default function MarketGapPage() {
  const { district, setDistrict } = useAppStore();
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [gapData, setGapData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDistricts().then((d) => Array.isArray(d) && setDistrictsList(d)).catch(console.warn);
  }, []);

  useEffect(() => {
    if (district) {
      setLoading(true);
      getMarketGap(district)
        .then(setGapData)
        .catch(console.warn)
        .finally(() => setLoading(false));
    }
  }, [district]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold mb-1.5">
            <TrendingUp className="w-3 h-3 text-rose-600" /> Module 7: Market Gap & Saturation Analysis
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Market Gap Analysis & Sector Saturation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover underserved rural economic sectors with high demand and avoid oversaturated business lines in {district}.
          </p>
        </div>

        {/* District Switcher */}
        <div>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white font-bold outline-none shadow-sm"
          >
            {districtsList.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Underserved Sectors (High Opportunity) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <h3 className="font-bold text-slate-900 text-base">Underserved High-Potential Sectors (High Demand / Low Supply)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {gapData?.underserved_sectors?.map((sec: any, idx: number) => (
            <div key={idx} className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-slate-900 text-sm">{sec.sector_name}</h4>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                  Gap Index: {sec.gap_index}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>Demand: <b className="text-slate-800">{sec.demand_level}</b></span>
                <span>Saturation: <b className="text-emerald-700">{sec.supply_saturation}</b></span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Recommended Ventures:</span>
                <ul className="space-y-1">
                  {sec.suggested_businesses?.map((b: string, bIdx: number) => (
                    <li key={bIdx} className="text-xs text-slate-700 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. High Demand Emerging Sectors */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <h3 className="font-bold text-slate-900 text-base">High-Demand Sectors (Balanced Competition)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {gapData?.high_demand_sectors?.map((sec: any, idx: number) => (
            <div key={idx} className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-slate-900 text-sm">{sec.sector_name}</h4>
                <span className="text-[10px] font-black text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md shrink-0">
                  Gap Index: {sec.gap_index}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>Demand: <b className="text-slate-800">{sec.demand_level}</b></span>
                <span>Saturation: <b className="text-blue-700">{sec.supply_saturation}</b></span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Suggested Businesses:</span>
                <ul className="space-y-1">
                  {sec.suggested_businesses?.map((b: string, bIdx: number) => (
                    <li key={bIdx} className="text-xs text-slate-700 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Saturated Sectors (High Risk) */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
          <h3 className="font-bold text-slate-900 text-base">Saturated Sectors (High Risk of Pricing Pressure)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {gapData?.saturated_sectors?.map((sec: any, idx: number) => (
            <div key={idx} className="bg-amber-50/50 rounded-2xl border border-amber-200 p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-slate-900 text-sm">{sec.sector_name}</h4>
                <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md shrink-0">
                  Saturated (Gap {sec.gap_index})
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-snug">
                Excess competitor concentration suppresses profit margins unless you innovate with specialized product lines.
              </p>

              <div className="pt-2 border-t border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 block mb-1">Differentiation Strategy:</span>
                <ul className="space-y-1">
                  {sec.suggested_businesses?.map((b: string, bIdx: number) => (
                    <li key={bIdx} className="text-xs text-slate-700 flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

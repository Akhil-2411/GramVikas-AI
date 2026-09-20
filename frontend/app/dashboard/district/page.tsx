"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Building2,
  TrendingUp,
  MapPin,
  Award,
  Users,
  PieChart as PieIcon
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useAppStore } from "@/lib/store";
import { getDistricts, getDistrictAnalytics } from "@/lib/api";

const SECTOR_COLORS = ["#059669", "#2563eb", "#d97706", "#9333ea", "#e11d48"];

export default function DistrictAnalyticsPage() {
  const { district, setDistrict } = useAppStore();
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [districtData, setDistrictData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDistricts().then((d) => Array.isArray(d) && setDistrictsList(d)).catch(console.warn);
  }, []);

  useEffect(() => {
    if (district) {
      setLoading(true);
      getDistrictAnalytics(district)
        .then(setDistrictData)
        .catch(console.warn)
        .finally(() => setLoading(false));
    }
  }, [district]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold mb-1.5">
            <BarChart3 className="w-3 h-3 text-blue-600" /> Module 8: District MSME Intelligence
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            District Enterprise Analytics & Sector Breakdown
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive breakdown of 33 Telangana districts powered by district_msme_final.csv dataset.
          </p>
        </div>

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

      {/* KPI Stats Row */}
      {districtData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Total MSMEs</span>
            <span className="text-2xl font-black text-slate-900">
              {districtData.total_msmes?.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-1">
              Registered in {district}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Competition Level</span>
            <span className="text-2xl font-black text-blue-700">
              {districtData.competition_level}
            </span>
            <span className="text-[11px] text-blue-600 font-medium block mt-1">
              Index: {districtData.competition_index} / 100
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Opportunity Score</span>
            <span className="text-2xl font-black text-emerald-700">
              {districtData.opportunity_index}%
            </span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-1">
              High Growth Headroom
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Micro Enterprises</span>
            <span className="text-2xl font-black text-purple-700">
              {districtData.micro_enterprises?.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              Small: {districtData.small_enterprises} • Medium: {districtData.medium_enterprises}
            </span>
          </div>
        </div>
      )}

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Industry Breakdown Bar Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Key Industry Cluster Volumes</h3>
              <p className="text-xs text-slate-500">Sector-wise operational enterprise count in {district}</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData?.industry_breakdown || []}>
                <XAxis dataKey="sector" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString("en-IN")} units`, "Registered"]}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="units" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Breakdown Pie Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Sector Share Ratio</h3>
            <p className="text-xs text-slate-500 mb-4">Relative industry distribution</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={districtData?.industry_breakdown || []}
                    dataKey="units"
                    nameKey="sector"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    innerRadius={35}
                  >
                    {(districtData?.industry_breakdown || []).map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [val.toLocaleString("en-IN"), "Enterprises"]}
                    contentStyle={{ borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1 pt-4 border-t border-slate-100 text-xs">
            {(districtData?.industry_breakdown || []).map((sec: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-600 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length] }} />
                  {sec.sector}
                </span>
                <span className="font-bold text-slate-900">{sec.units.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Compass,
  Calculator,
  MapPin,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  FileText
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
import { translations } from "@/lib/translations";
import { getOverview, getDistricts } from "@/lib/api";

const PIE_COLORS = ["#059669", "#2563eb", "#d97706"];

export default function DashboardPage() {
  const {
    district,
    setDistrict,
    mandal,
    setMandal,
    village,
    setVillage,
    marginCapital,
    language
  } = useAppStore();

  const t = translations[language];
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dList, ov] = await Promise.allSettled([getDistricts(), getOverview()]);
        if (dList.status === "fulfilled" && Array.isArray(dList.value)) {
          setDistrictsList(dList.value);
        }
        if (ov.status === "fulfilled") {
          setOverview(ov.value);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Static fallback data for charts if API loading
  const barData = overview?.top_opportunity_districts || [
    { district: "Nagarkurnool", opportunity_score: 88, competition: "Low" },
    { district: "Wanaparthy", opportunity_score: 87, competition: "Low" },
    { district: "K. Bheem", opportunity_score: 89, competition: "Low" },
    { district: "Adilabad", opportunity_score: 85, competition: "Medium" },
    { district: "Kamareddy", opportunity_score: 84, competition: "Medium" },
    { district: "Mahabubnagar", opportunity_score: 82, competition: "Medium" },
  ];

  const pieData = [
    { name: "Micro (<= 1 Cr)", value: 726186 },
    { name: "Small (<= 10 Cr)", value: 9574 },
    { name: "Medium (<= 50 Cr)", value: 737 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Welcome Banner with Location Selector */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-emerald-900/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/60 border border-emerald-400/30 text-emerald-100 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Ministry of Social Justice and Empowerment (MoSJE)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Rural MSME Advisory & Financial Dashboard
            </h1>
            <p className="text-emerald-100/90 text-sm mt-1 max-w-xl">
              Targeted business feasibility, competition benchmarking, and 90% concessional scheme eligibility for Telangana entrepreneurs.
            </p>
          </div>

          {/* Quick Location Switcher */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-xs shrink-0 sm:min-w-[280px]">
            <label className="text-emerald-200 font-semibold block mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Active Target District
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-white text-slate-900 font-bold rounded-lg px-3 py-2 outline-none cursor-pointer"
            >
              {districtsList.length > 0 ? (
                districtsList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))
              ) : (
                <option value="Adilabad">Adilabad</option>
              )}
            </select>
            <span className="text-[10px] text-emerald-200 block mt-1.5">
              Census Centroids: 10,455 Villages Indexed
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>{t.totalMSMEs}</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">736,497</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Telangana Verified Master DB</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>{t.districtsCovered}</span>
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">33 / 33</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">100% State Coverage</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>{t.villagesCovered}</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">10,455</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">EPSG:7755 Georeferenced</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>{t.categories}</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">1,072</div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">NIC Activity Classes</div>
        </div>
      </div>

      {/* 3. Interactive Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Opportunity Districts Bar Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Top Opportunity Districts</h3>
              <p className="text-xs text-slate-500">Benchmark Opportunity Index based on MSME Competition & Market Gap</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Low Competition High Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="district" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} / 100`, "Opportunity Score"]}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="opportunity_score" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enterprise Classification Pie Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">MSME Scale Breakdown</h3>
            <p className="text-xs text-slate-500 mb-4">Enterprise tiering across Telangana state</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    innerRadius={40}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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

          <div className="space-y-1.5 pt-4 border-t border-slate-100 text-xs">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Micro (98.6%)
              </span>
              <span className="font-bold text-slate-900">726,186</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Small (1.3%)
              </span>
              <span className="font-bold text-slate-900">9,574</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> Medium (0.1%)
              </span>
              <span className="font-bold text-slate-900">737</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Action Feature Launchpad */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">Core Advisory Workflows</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/advisory"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Business Advisor</h4>
            <p className="text-xs text-slate-500">Discover recommended businesses tailored to your budget.</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-3">
              Explore <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/dashboard/finance"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
              <Calculator className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Financial Planner</h4>
            <p className="text-xs text-slate-500">Calculate 90% loan eligibility and 5-year EMI schedules.</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 mt-3">
              Calculate <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/dashboard/map"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Village Intelligence</h4>
            <p className="text-xs text-slate-500">Interactive maps with village boundary & MSME density overlays.</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 mt-3">
              View Map <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/dashboard/radius"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Radius Analysis</h4>
            <p className="text-xs text-slate-500">Analyze 5-10 km reachable consumer population and villages.</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 mt-3">
              Run Radius <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

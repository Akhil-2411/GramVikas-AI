"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Building2,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getDistricts, getMandals, getVillages, getBusinessRecommendations, getReportDownloadUrl } from "@/lib/api";

export default function BusinessAdvisoryPage() {
  const {
    district,
    setDistrict,
    mandal,
    setMandal,
    village,
    setVillage,
    marginCapital,
    setMarginCapital,
    businessCategory,
    setBusinessCategory,
    gender,
    socialCategory,
    setDemographics
  } = useAppStore();

  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [mandalsList, setMandalsList] = useState<string[]>([]);
  const [villagesList, setVillagesList] = useState<any[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load districts
  useEffect(() => {
    getDistricts().then((d) => Array.isArray(d) && setDistrictsList(d)).catch(console.warn);
  }, []);

  // Load mandals when district changes
  useEffect(() => {
    if (district) {
      getMandals(district).then((m) => Array.isArray(m) && setMandalsList(m)).catch(console.warn);
    }
  }, [district]);

  // Load villages when mandal changes
  useEffect(() => {
    if (district) {
      getVillages(district, mandal).then((v) => Array.isArray(v) && setVillagesList(v)).catch(console.warn);
    }
  }, [district, mandal]);

  // Run analysis
  const runAnalysis = async () => {
    setLoading(true);
    try {
      const data = await getBusinessRecommendations({
        district,
        village,
        business_category: businessCategory,
        margin_capital: marginCapital,
        gender,
        social_category: socialCategory,
      });
      setAnalysisResult(data);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [district, village, businessCategory, marginCapital]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1.5">
            <Compass className="w-3 h-3" /> Module 1: Hyper-Local Business Discovery
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Business Recommendation Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify viable, low-risk business opportunities tailored to your capital and local mandal ecosystem.
          </p>
        </div>

        <a
          href={getReportDownloadUrl(district, village, businessCategory, marginCapital)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
        >
          <Download className="w-4 h-4 text-emerald-600" /> Export PDF Appraisal
        </a>
      </div>

      {/* Input Parameters Filter Grid */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-xs pb-3 border-b border-slate-100">
          <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filter Criteria & Demographics
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* District */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {districtsList.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Mandal */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mandal / Sub-District</label>
            <select
              value={mandal}
              onChange={(e) => setMandal(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Mandals</option>
              {mandalsList.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Village */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Village Panchayat</label>
            <select
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select Village</option>
              {villagesList.map((v) => (
                <option key={v.id} value={v.village_name}>{v.village_name}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Industry Preference</label>
            <select
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Categories</option>
              <option value="Food Processing">Food Processing & Milling</option>
              <option value="Dairy & Animal Husbandry">Dairy & Animal Husbandry</option>
              <option value="Textiles & Handloom">Textiles & Apparel</option>
              <option value="Eco-Packaging & Crafts">Eco-Packaging & Leaf Plates</option>
              <option value="Rural Services & Repair">Rural Services & Repair</option>
            </select>
          </div>
        </div>

        {/* Capital Slider & Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 items-center">
          <div className="md:col-span-8">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">Available Margin Capital:</span>
              <span className="text-emerald-700 font-black text-sm">₹{marginCapital.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={500000}
              step={5000}
              value={marginCapital}
              onChange={(e) => setMarginCapital(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹10,000 (Micro Scale)</span>
              <span>₹2,50,000 (Medium Unit)</span>
              <span>₹5,00,000 (₹50L Project Max)</span>
            </div>
          </div>

          <div className="md:col-span-4 flex items-center gap-3">
            <div className="w-1/2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setDemographics(e.target.value, socialCategory)}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs bg-slate-50"
              >
                <option value="Male">Male</option>
                <option value="Female">Female (Special Subsidy)</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category</label>
              <select
                value={socialCategory}
                onChange={(e) => setDemographics(gender, e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs bg-slate-50"
              >
                <option value="General">General</option>
                <option value="OBC">OBC (NBCFDC)</option>
                <option value="SC">SC (NSFDC)</option>
                <option value="ST">ST (NSTFDC)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* District Market Overview Bar */}
      {analysisResult && (
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              {analysisResult.opportunity_score}
            </div>
            <div>
              <span className="font-bold text-slate-900 block">District Market Verdict: {analysisResult.verdict}</span>
              <span className="text-slate-500 text-[11px]">
                {district}: {analysisResult.district_overview?.total?.toLocaleString()} registered MSMEs • Competition: {analysisResult.district_overview?.competition}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
            <span className="text-emerald-700">Opportunity: {analysisResult.opportunity_score}%</span>
            <span className="text-blue-700">Competition: {analysisResult.competition_score}%</span>
            <span className="text-amber-700">Risk: {analysisResult.risk_score}%</span>
          </div>
        </div>
      )}

      {/* Recommended Business Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" /> Top Ranked Enterprise Opportunities
        </h3>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Evaluating market viability...</div>
        ) : analysisResult?.recommendations ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {analysisResult.recommendations.map((rec: any) => (
              <div
                key={rec.rank}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                        #{rec.rank}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                        {rec.category}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {rec.opportunity_score}% Opp.
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base mb-1.5">{rec.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{rec.description}</p>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-center mb-4 border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Total Investment</span>
                      <span className="font-bold text-xs text-slate-900">₹{rec.investment_required?.toLocaleString("en-IN")}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Est. Revenue</span>
                      <span className="font-bold text-xs text-emerald-700">₹{rec.estimated_revenue?.toLocaleString("en-IN")}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Profit Margin</span>
                      <span className="font-bold text-xs text-blue-700">{rec.profit_margin}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <Link
                    href={`/dashboard/swot?title=${encodeURIComponent(rec.title)}&category=${encodeURIComponent(rec.category)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> View SWOT Matrix
                  </Link>

                  <Link
                    href="/dashboard/finance"
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900"
                  >
                    Calculate EMI <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

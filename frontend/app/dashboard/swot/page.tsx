"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  Download,
  Building2,
  Info
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getSwotAnalysis, getReportDownloadUrl } from "@/lib/api";

export default function SwotAnalysisPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading SWOT Model...</div>}>
      <SwotAnalysisContent />
    </Suspense>
  );
}

function SwotAnalysisContent() {
  const searchParams = useSearchParams();
  const { district, village, marginCapital } = useAppStore();

  const titleParam = searchParams.get("title") || "Cold-Pressed Edible Oil Extraction Unit";
  const categoryParam = searchParams.get("category") || "Food Processing";

  const [businessTitle, setBusinessTitle] = useState(titleParam);
  const [swotData, setSwotData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSwot() {
      setLoading(true);
      try {
        const res = await getSwotAnalysis({
          title: businessTitle,
          category: categoryParam,
          district,
          margin_capital: marginCapital,
        });
        setSwotData(res);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    }
    loadSwot();
  }, [businessTitle, district, marginCapital]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold mb-1.5">
            <Sparkles className="w-3 h-3 text-blue-600" /> Module 2: AI SWOT & Causal Assessment
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Strategic AI SWOT Matrix with Causal Reasoning
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed evaluation of <b>why</b> each strength, vulnerability, growth avenue, and external risk exists in {district}.
          </p>
        </div>

        <a
          href={getReportDownloadUrl(district, village, categoryParam, marginCapital)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
        >
          <Download className="w-4 h-4" /> Download SWOT PDF
        </a>
      </div>

      {/* Selected Business Overview Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active Business Focus</span>
          <h2 className="text-xl font-bold text-slate-900">{businessTitle}</h2>
          <span className="text-xs text-slate-500">
            Location: <b>{district}</b> {village ? `• ${village}` : ""} | Margin: <b>₹{marginCapital.toLocaleString("en-IN")}</b>
          </span>
        </div>

        {/* 4 Score Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[10px] text-emerald-600 font-semibold block">Opportunity</span>
            <span className="text-sm font-black text-emerald-800">84 / 100</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
            <span className="text-[10px] text-blue-600 font-semibold block">Competition</span>
            <span className="text-sm font-black text-blue-800">42 / 100</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[10px] text-amber-600 font-semibold block">Risk Score</span>
            <span className="text-sm font-black text-amber-800">28 / 100</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-center">
            <span className="text-[10px] text-purple-600 font-semibold block">Financial Viability</span>
            <span className="text-sm font-black text-purple-800">88%</span>
          </div>
        </div>
      </div>

      {/* 4 Quadrants Matrix */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Generating deep causal SWOT model...</div>
      ) : swotData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. STRENGTHS (Emerald) */}
          <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-emerald-950 uppercase tracking-wide">
                    Strengths (Internal Advantages)
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {swotData.strengths?.length || 3} Points
                </span>
              </div>

              <div className="space-y-4">
                {swotData.strengths?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white/90 p-4 rounded-xl border border-emerald-100 shadow-xs">
                    <h4 className="font-bold text-slate-900 text-xs mb-1 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                      {item.point}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed pl-3 border-l-2 border-emerald-300 ml-0.5 mt-1">
                      <b className="text-emerald-800">WHY THIS EXISTS:</b> {item.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. WEAKNESSES (Rose) */}
          <div className="bg-rose-50/40 border border-rose-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-rose-200 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-rose-950 uppercase tracking-wide">
                    Weaknesses (Internal Challenges)
                  </h3>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                  {swotData.weaknesses?.length || 2} Points
                </span>
              </div>

              <div className="space-y-4">
                {swotData.weaknesses?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white/90 p-4 rounded-xl border border-rose-100 shadow-xs">
                    <h4 className="font-bold text-slate-900 text-xs mb-1 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1 shrink-0" />
                      {item.point}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed pl-3 border-l-2 border-rose-300 ml-0.5 mt-1">
                      <b className="text-rose-800">WHY THIS EXISTS:</b> {item.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. OPPORTUNITIES (Blue) */}
          <div className="bg-blue-50/40 border border-blue-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-blue-200 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-blue-950 uppercase tracking-wide">
                    Opportunities (External Potential)
                  </h3>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  {swotData.opportunities?.length || 3} Points
                </span>
              </div>

              <div className="space-y-4">
                {swotData.opportunities?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white/90 p-4 rounded-xl border border-blue-100 shadow-xs">
                    <h4 className="font-bold text-slate-900 text-xs mb-1 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                      {item.point}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed pl-3 border-l-2 border-blue-300 ml-0.5 mt-1">
                      <b className="text-blue-800">WHY THIS EXISTS:</b> {item.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. THREATS (Amber) */}
          <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-amber-200 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-amber-950 uppercase tracking-wide">
                    Threats (External Risks)
                  </h3>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {swotData.threats?.length || 2} Points
                </span>
              </div>

              <div className="space-y-4">
                {swotData.threats?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white/90 p-4 rounded-xl border border-amber-100 shadow-xs">
                    <h4 className="font-bold text-slate-900 text-xs mb-1 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1 shrink-0" />
                      {item.point}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed pl-3 border-l-2 border-amber-300 ml-0.5 mt-1">
                      <b className="text-amber-800">WHY THIS EXISTS:</b> {item.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

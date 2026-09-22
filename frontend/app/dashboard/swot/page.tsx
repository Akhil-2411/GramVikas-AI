"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  Download,
  Compass,
  ArrowRight,
  Info
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getSwotAnalysis, getReportDownloadUrl } from "@/lib/api";

const INDUSTRY_DISPLAY_NAMES: Record<string, string> = {
  "Food Processing": "Food Processing & Milling",
  "Dairy & Animal Husbandry": "Dairy & Animal Husbandry",
  "Textiles & Handloom": "Textiles & Apparel",
  "Eco-Packaging & Crafts": "Eco-Packaging & Leaf Plates",
  "Rural Services & Repair": "Rural Services & Repair",
};

function getIndustryDisplayName(val: string): string {
  if (!val) return "";
  return INDUSTRY_DISPLAY_NAMES[val] || val;
}

function getIndustryCategoryKey(val: string): string {
  for (const [key, label] of Object.entries(INDUSTRY_DISPLAY_NAMES)) {
    if (label.toLowerCase() === val.toLowerCase()) {
      return key;
    }
  }
  return val;
}

export default function SwotAnalysisPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading SWOT Model...</div>}>
      <SwotAnalysisContent />
    </Suspense>
  );
}

function SwotAnalysisContent() {
  const searchParams = useSearchParams();
  const { district, mandal, village, marginCapital, businessCategory } = useAppStore();

  const titleParam = searchParams.get("title")?.trim() || "";
  const categoryParam = searchParams.get("category")?.trim() || "";

  // 1. Check if user clicked "View SWOT Matrix" from a recommendation card
  const hasRecommendation = Boolean(titleParam);

  // 2. Check if user has an Industry Preference selected in Business Advisor
  const candidateIndustry = categoryParam || businessCategory || "";
  const isGenericOrAll =
    !candidateIndustry ||
    ["all", "all categories", "any", "none"].includes(candidateIndustry.toLowerCase().trim());
  const hasIndustryPreference = !hasRecommendation && !isGenericOrAll;

  // Active business exists if recommendation was clicked OR industry preference was selected
  const hasActiveBusiness = hasRecommendation || hasIndustryPreference;

  const activeBusinessTitle = hasRecommendation
    ? titleParam
    : hasIndustryPreference
    ? getIndustryDisplayName(candidateIndustry)
    : "";

  const activeCategory = hasRecommendation
    ? (categoryParam || (isGenericOrAll ? "General" : candidateIndustry) || "General")
    : hasIndustryPreference
    ? getIndustryCategoryKey(candidateIndustry)
    : "";

  const [swotData, setSwotData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasActiveBusiness || !activeBusinessTitle) {
      setSwotData(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadSwot() {
      setLoading(true);
      try {
        const res = await getSwotAnalysis({
          title: activeBusinessTitle,
          category: activeCategory,
          district,
          mandal,
          village,
          margin_capital: marginCapital,
        });
        if (isMounted) {
          setSwotData(res);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadSwot();

    return () => {
      isMounted = false;
    };
  }, [hasActiveBusiness, activeBusinessTitle, activeCategory, district, mandal, village, marginCapital]);

  const oppScore = swotData?.opportunity_score ?? 84.0;
  const compScore = swotData?.competition_score ?? 42.0;
  const riskScore = swotData?.risk_score ?? 28.0;
  const viabilityScore = swotData?.financial_viability_score ?? 88.0;

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

        {hasActiveBusiness ? (
          <a
            href={getReportDownloadUrl(district, village, activeCategory, marginCapital)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            <Download className="w-4 h-4" /> Download SWOT PDF
          </a>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-2 bg-slate-100 text-slate-400 text-xs font-bold px-4 py-2.5 rounded-xl cursor-not-allowed"
          >
            <Download className="w-4 h-4" /> Download SWOT PDF
          </button>
        )}
      </div>

      {!hasActiveBusiness ? (
        /* Empty State */
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-sm my-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5 text-emerald-600 shadow-xs">
            <Compass className="w-8 h-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold mb-3">
            <Info className="w-3.5 h-3.5 text-slate-500" /> No Active Business Focus
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            Select an Industry or Recommendation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
            To view strategic causal SWOT insights, please choose an Industry Preference or click &ldquo;View SWOT Matrix&rdquo; on an enterprise recommendation in the Business Advisor.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard/advisory"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-sm hover:shadow transition"
            >
              <Compass className="w-4 h-4" /> Go to Business Advisor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Selected Business Overview Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active Business Focus</span>
              <h2 className="text-xl font-bold text-slate-900">{activeBusinessTitle}</h2>
              <span className="text-xs text-slate-500">
                Location: <b>{district}</b> {mandal ? `• ${mandal}` : ""} {village ? `• ${village}` : ""} | Margin: <b>₹{marginCapital.toLocaleString("en-IN")}</b>
              </span>
            </div>

            {/* 4 Dynamic Score Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center min-w-[90px]">
                <span className="text-[10px] text-emerald-600 font-semibold block">Opportunity</span>
                <span className="text-sm font-black text-emerald-800">{oppScore} / 100</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-center min-w-[90px]">
                <span className="text-[10px] text-blue-600 font-semibold block">Competition</span>
                <span className="text-sm font-black text-blue-800">{compScore} / 100</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-center min-w-[90px]">
                <span className="text-[10px] text-amber-600 font-semibold block">Risk Score</span>
                <span className="text-sm font-black text-amber-800">{riskScore} / 100</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-center min-w-[90px]">
                <span className="text-[10px] text-purple-600 font-semibold block">Viability</span>
                <span className="text-sm font-black text-purple-800">{viabilityScore}%</span>
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
        </>
      )}
    </div>
  );
}

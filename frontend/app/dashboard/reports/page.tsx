"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
  Share2,
  Compass,
  ArrowRight,
  Printer
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getReportDownloadUrl } from "@/lib/api";

export default function ReportsPage() {
  const { district, village, marginCapital, businessCategory } = useAppStore();

  const savedReports = [
    {
      id: "REP-2026-001",
      title: `MSME Feasibility Appraisal: ${businessCategory}`,
      district: district,
      village: village || "Tamsi-B",
      category: businessCategory,
      margin: marginCapital,
      projectCost: marginCapital / 0.10,
      date: "Today",
      scheme: marginCapital <= 14000 ? "Micro Finance (6.5%)" : "Term Loan Scheme (8.0%)",
    },
    {
      id: "REP-2026-002",
      title: "Dairy Chilling & Collection Center Feasibility",
      district: "Adilabad",
      village: "Kuchalapoor",
      category: "Dairy & Animal Husbandry",
      margin: 80000,
      projectCost: 800000,
      date: "Yesterday",
      scheme: "Term Loan Scheme (8.0%)",
    },
    {
      id: "REP-2026-003",
      title: "Cold Pressed Edible Oil Extraction Unit",
      district: "Karimnagar",
      village: "Manakondur",
      category: "Food Processing",
      margin: 100000,
      projectCost: 1000000,
      date: "3 days ago",
      scheme: "Term Loan Scheme (8.0%)",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold mb-1.5">
            <FileText className="w-3 h-3 text-indigo-600" /> Module 9: Project Appraisal & PDF Generation
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Generated Feasibility & Loan Appraisal Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Download comprehensive executive project reports structured for State Channelizing Agencies (SCAs) and bank appraisal.
          </p>
        </div>

        <a
          href={getReportDownloadUrl(district, village, businessCategory, marginCapital)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
        >
          <Download className="w-4 h-4" /> Export Active Report (PDF)
        </a>
      </div>

      {/* Active Report Spotlight Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-300">Active Live Report</span>
          <h2 className="text-xl font-bold mt-1">
            {businessCategory} Feasibility Plan — {district}
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl leading-relaxed">
            Incorporates Project Cost calculation (₹{(marginCapital / 0.10).toLocaleString("en-IN")}), 90% Concessional Loan
            Eligibility, 5-Year Cashflow Projections, Causal SWOT Matrix, and 5 km Radius Demographic Reach.
          </p>
        </div>

        <a
          href={getReportDownloadUrl(district, village, businessCategory, marginCapital)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-emerald-900 font-extrabold text-xs px-5 py-3 rounded-xl shadow hover:bg-emerald-50 transition shrink-0"
        >
          <Download className="w-4 h-4 text-emerald-700" /> Download Official PDF
        </a>
      </div>

      {/* Saved Reports List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-900">
          Generated Project Appraisals Archive
        </div>

        <div className="divide-y divide-slate-100">
          {savedReports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {rep.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800">
                    {rep.scheme}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{rep.title}</h4>
                <p className="text-xs text-slate-500">
                  Location: <b>{rep.district}</b> ({rep.village}) • Margin: <b>₹{rep.margin.toLocaleString("en-IN")}</b> • Project Outlay: <b>₹{rep.projectCost.toLocaleString("en-IN")}</b>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={getReportDownloadUrl(rep.district, rep.village, rep.category, rep.margin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

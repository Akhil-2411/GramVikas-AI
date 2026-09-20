"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Filter,
  ArrowRight,
  Download,
  Building2,
  AlertCircle
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getSchemes } from "@/lib/api";

export default function SchemeFinderPage() {
  const { gender, socialCategory, marginCapital } = useAppStore();
  const [selectedGender, setSelectedGender] = useState(gender || "All");
  const [selectedCategory, setSelectedCategory] = useState(socialCategory || "General");
  const [budget, setBudget] = useState(marginCapital ? marginCapital / 0.10 : 1000000);
  const [schemesData, setSchemesData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<any>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getSchemes({
          gender: selectedGender,
          category: selectedCategory,
          budget,
        });
        setSchemesData(res);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedGender, selectedCategory, budget]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold mb-1.5">
            <Award className="w-3 h-3 text-amber-600" /> Module 4: Government Scheme Finder
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Concessional Finance & Government Schemes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover matched central and state government credit schemes with interest subventions and capital subsidies.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">
          <Filter className="w-3.5 h-3.5 text-emerald-600" /> Applicant Demographic & Scale Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Applicant Gender</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 outline-none"
            >
              <option value="All">All Applicants</option>
              <option value="Male">Male</option>
              <option value="Female">Female (Special Subsidy Eligible)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Social Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 outline-none"
            >
              <option value="General">General Category</option>
              <option value="OBC">OBC (NBCFDC Concessional Rate)</option>
              <option value="SC">SC (NSFDC Concessional Rate)</option>
              <option value="ST">ST (NSTFDC Concessional Rate)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Total Project Outlay (₹)</label>
            <select
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 outline-none font-bold text-emerald-700"
            >
              <option value={120000}>₹1.20 Lakh (Micro Finance Target)</option>
              <option value={500000}>₹5.00 Lakh (MUDRA Kishore)</option>
              <option value={1000000}>₹10.00 Lakh (Term Loan Mid-scale)</option>
              <option value={2500000}>₹25.00 Lakh (PMEGP Manufacturing)</option>
              <option value={5000000}>₹50.00 Lakh (Max MoSJE Ceiling)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Matched Concessional Schemes ({schemesData?.eligible_schemes?.length || 0})
        </h3>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Evaluating scheme eligibility matrices...</div>
        ) : schemesData?.eligible_schemes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {schemesData.eligible_schemes.map((scheme: any) => (
              <div
                key={scheme.id}
                className={`bg-white rounded-2xl border p-6 shadow-sm transition flex flex-col justify-between ${
                  scheme.eligible
                    ? "border-emerald-300 hover:border-emerald-500 hover:shadow-md"
                    : "border-slate-200 opacity-75"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {scheme.ministry}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        scheme.eligible
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {scheme.eligible ? "ELIGIBLE" : "NOT APPLICABLE"}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1.5">{scheme.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{scheme.benefits}</p>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-center mb-4 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Loan Coverage</span>
                      <span className="font-bold text-slate-900">{scheme.coverage_pct}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Interest Rate</span>
                      <span className="font-bold text-emerald-700">{scheme.interest_rate}% p.a.</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Tenure</span>
                      <span className="font-bold text-blue-700">{scheme.tenure_years} Years</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 mb-4">
                    <span className="font-bold text-emerald-950 block text-[11px] mb-1">Key Eligibility:</span>
                    <p className="text-[11px] leading-snug">{scheme.eligibility}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setActiveModal(scheme)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <FileText className="w-3.5 h-3.5" /> Required Documents ({scheme.required_documents?.length || 4})
                  </button>

                  <span className="text-[11px] font-bold text-slate-500">
                    Moratorium: {scheme.moratorium_months} Mo.
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Document Checklist Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Application Checklist</span>
                <h3 className="font-bold text-base text-slate-900">{activeModal.name}</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <span className="text-xs font-bold text-slate-700 block">Required Documentation for Loan Sanction:</span>
              <ul className="space-y-2">
                {activeModal.required_documents?.map((doc: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
            >
              Close Checklist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

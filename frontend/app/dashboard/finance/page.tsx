"use client";

import React, { useState, useEffect } from "react";
import {
  Calculator,
  TrendingUp,
  Award,
  Download,
  AlertCircle,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { useAppStore } from "@/lib/store";
import { calculateFinancials, getReportDownloadUrl } from "@/lib/api";

export default function FinancialPlannerPage() {
  const { district, village, marginCapital, setMarginCapital, businessCategory } = useAppStore();
  const [finData, setFinData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFin() {
      setLoading(true);
      try {
        const res = await calculateFinancials(marginCapital);
        setFinData(res);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    }
    loadFin();
  }, [marginCapital]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold mb-1.5">
            <Calculator className="w-3 h-3 text-blue-600" /> Module 3: Smart Financial Structuring
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Financial Feasibility & 90% Loan Structuring
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Algorithmic implementation of Ministry of Social Justice & Empowerment concessional lending rules.
          </p>
        </div>

        <a
          href={getReportDownloadUrl(district, village, businessCategory, marginCapital)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
        >
          <Download className="w-4 h-4" /> Download Financial DPR
        </a>
      </div>

      {/* Interactive Capital Slider */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Enter Your Available Margin Capital</h3>
            <p className="text-xs text-slate-500">Government schemes provide 90% loan coverage against your 10% self-contribution.</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-600">₹{marginCapital.toLocaleString("en-IN")}</span>
            <span className="text-[10px] text-slate-400 block">Founder Equity Contribution</span>
          </div>
        </div>

        <input
          type="range"
          min={10000}
          max={550000}
          step={5000}
          value={marginCapital}
          onChange={(e) => setMarginCapital(Number(e.target.value))}
          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />

        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span>₹10,000 (Micro Scale)</span>
          <span>₹1,40,000 (Max Micro Threshold)</span>
          <span>₹5,00,000 (₹50 Lakh Project Max)</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {finData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Total Project Cost</span>
            <span className="text-2xl font-black text-slate-900">₹{finData.project_cost?.toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-1">Margin Capital ÷ 10%</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Maximum Loan (90%)</span>
            <span className="text-2xl font-black text-emerald-700">₹{finData.loan_amount?.toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-1">Concessional Credit</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Monthly EMI</span>
            <span className="text-2xl font-black text-blue-700">₹{finData.monthly_emi?.toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              Quarterly: ₹{finData.quarterly_emi?.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Viability Score</span>
            <span className="text-2xl font-black text-purple-700">{finData.financial_viability_score}%</span>
            <span className="text-[11px] text-purple-600 font-medium block mt-1">
              Break-Even: {finData.break_even_months} Mo.
            </span>
          </div>
        </div>
      )}

      {/* Scheme Routing Banner */}
      {finData && (
        <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          finData.eligibility === "ELIGIBLE"
            ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
            : "bg-rose-50 border-rose-200 text-rose-950"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
              finData.eligibility === "ELIGIBLE" ? "bg-emerald-600" : "bg-rose-600"
            }`}>
              {finData.eligibility === "ELIGIBLE" ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base">{finData.scheme}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  finData.eligibility === "ELIGIBLE" ? "bg-emerald-200 text-emerald-900" : "bg-rose-200 text-rose-900"
                }`}>
                  {finData.eligibility}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{finData.first_emi_note}</p>
            </div>
          </div>

          {finData.eligibility === "ELIGIBLE" && (
            <div className="flex items-center gap-6 text-xs font-semibold shrink-0">
              <div>
                <span className="text-slate-500 block text-[10px]">Interest Rate</span>
                <span className="text-slate-900 font-bold">{finData.interest_rate}% p.a.</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Tenure</span>
                <span className="text-slate-900 font-bold">{finData.tenure_years} Years</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Moratorium</span>
                <span className="text-slate-900 font-bold">{finData.moratorium_months} Months</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5-Year Cashflow Line Chart */}
      {finData?.cashflow_forecast && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">5-Year Revenue & Repayment Forecast</h3>
              <p className="text-xs text-slate-500">Projected annual gross revenues, debt obligations, and net margins</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              Avg ROI: {finData.roi_percent}%
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={finData.cashflow_forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tickFormatter={(y) => `Year ${y}`} tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, ""]}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="gross_revenue" name="Gross Revenue" stroke="#059669" strokeWidth={2.5} />
                <Line type="monotone" dataKey="operating_expenses" name="Operating Expenses" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="net_profit" name="Net Profit" stroke="#2563eb" strokeWidth={2.5} />
                <Line type="monotone" dataKey="loan_repayment" name="Annual Loan EMI" stroke="#dc2626" strokeDasharray="4 4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Cashflow Breakdown Table */}
      {finData?.cashflow_forecast && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-900">
            Multi-Year Amortization & Cashflow Schedule
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Gross Revenue</th>
                  <th className="px-4 py-3">Operating Expenses</th>
                  <th className="px-4 py-3">Annual EMI Repayment</th>
                  <th className="px-4 py-3">Net Profit</th>
                  <th className="px-4 py-3">Cumulative Cash Reserve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {finData.cashflow_forecast.map((row: any) => (
                  <tr key={row.year} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-bold text-slate-900">Year {row.year}</td>
                    <td className="px-4 py-3">₹{row.gross_revenue.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">₹{row.operating_expenses.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-rose-600 font-medium">₹{row.loan_repayment.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-emerald-700 font-bold">₹{row.net_profit.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-blue-700 font-bold">₹{row.cash_reserve.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

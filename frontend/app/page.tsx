"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShieldCheck,
  MapPin,
  FileText,
  Calculator,
  Compass,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  CheckCircle2,
  ChevronDown,
  PhoneCall,
  Globe,
  Award
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { translations } from "@/lib/translations";

export default function LandingPage() {
  const { language, setLanguage } = useAppStore();
  const t = translations[language];

  // Quick calculator state on hero
  const [quickMargin, setQuickMargin] = useState<number>(100000);
  const quickProjectCost = quickMargin / 0.10;
  const quickLoan = quickProjectCost * 0.90;
  const quickScheme = quickProjectCost <= 140000 ? "Micro Finance (6.5%)" : "Term Loan Scheme (8.0%)";

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does GramVikas AI calculate my loan eligibility?",
      a: "Under the Ministry of Social Justice and Empowerment (MoSJE) framework, rural entrepreneurs contribute 10% margin capital. The platform automatically calculates your total project cost (Margin Capital ÷ 10%) and routes 90% concessional loan coverage through eligible state channelizing agencies."
    },
    {
      q: "Which government schemes are supported?",
      a: "GramVikas AI integrates MoSJE Micro Finance Scheme (up to ₹1.4L @ 6.5%), MoSJE Term Loan Scheme (up to ₹50L @ 8.0%), Prime Minister Employment Generation Programme (PMEGP), MUDRA Yojana, and Stand-Up India for women and SC/ST founders."
    },
    {
      q: "What is the 5-10 km radius analysis?",
      a: "Using PostGIS and official Telangana census cartography (10,455 villages), the radius analysis tool draws 5 km and 10 km concentric trade zones around your village, calculating reachable customer populations and neighboring village commercial hubs."
    },
    {
      q: "Is the generated business report acceptable to banks?",
      a: "Yes. The platform generates an executive PDF feasibility report including 5-year cashflow forecasts, DSCR ratios, break-even timelines, and equipment capital quotations structured for bank loan officers."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                GramVikas <span className="text-emerald-600 font-black">AI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 ml-1">SIH 2026</span>
              </span>
              <p className="text-[11px] text-slate-500 hidden sm:block">MoSJE Rural MSME Advisory Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border border-slate-200 p-1 bg-slate-50 text-xs font-semibold">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-md transition ${language === "en" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("te")}
                className={`px-2.5 py-1 rounded-md transition ${language === "te" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-2.5 py-1 rounded-md transition ${language === "hi" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                हिन्दी
              </button>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/25 transition"
            >
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-emerald-50/30 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Problem Statement ID: 26091 | MoSJE Concessional Finance
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Empowering Rural Entrepreneurs with <span className="text-emerald-600 underline decoration-emerald-300 underline-offset-4">Data-Backed</span> AI Advisory
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Discover viable rural business opportunities across 10,455 Telangana villages. Evaluate competition, get 
                instant AI SWOT reports, calculate 90% concessional loan eligibility, and explore 5-10 km customer reach.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/dashboard/advisory"
                  className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                  Start Business Advisory <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/dashboard/map"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-base px-5 py-3.5 rounded-xl shadow-sm transition"
                >
                  <MapPin className="w-5 h-5 text-emerald-600" /> Explore GIS Map
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 736,000+ MSMEs Benchmarked</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 33 Telangana Districts</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 90% Scheme Loan Coverage</span>
              </div>
            </div>

            {/* Quick Financial Calculator Teaser */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-200/50 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-600">Interactive Preview</span>
                    <h3 className="font-bold text-xl text-slate-900">Instant Loan Structuring</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Calculator className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-600 font-medium">Your Available Margin Capital</span>
                      <span className="font-bold text-emerald-700 text-base">₹{quickMargin.toLocaleString("en-IN")}</span>
                    </div>
                    <input
                      type="range"
                      min={10000}
                      max={500000}
                      step={5000}
                      value={quickMargin}
                      onChange={(e) => setQuickMargin(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>₹10,000</span>
                      <span>₹2,50,000</span>
                      <span>₹5,00,000</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                      <span className="text-xs text-slate-500 block">Total Project Cost</span>
                      <span className="font-black text-lg text-slate-900">₹{quickProjectCost.toLocaleString("en-IN")}</span>
                      <span className="text-[10px] text-emerald-600 font-medium block">10x Founder Leverage</span>
                    </div>

                    <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-100">
                      <span className="text-xs text-emerald-800 block">Eligible Loan (90%)</span>
                      <span className="font-black text-lg text-emerald-700">₹{quickLoan.toLocaleString("en-IN")}</span>
                      <span className="text-[10px] text-emerald-600 font-medium block">Concessional Rate</span>
                    </div>
                  </div>

                  <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 flex items-start gap-3">
                    <Award className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-blue-900 block">Routed Scheme: {quickScheme}</span>
                      <p className="text-[11px] text-blue-700 leading-snug">
                        Eligible for {quickProjectCost <= 140000 ? "3-year tenure with 3-month moratorium" : "7-year tenure with 6-month moratorium under MoSJE rules"}.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard/finance"
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-3 rounded-xl shadow transition"
                  >
                    View Full 5-Year Cashflow Plan <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Key Platform Statistics */}
      <section className="py-14 bg-emerald-900 text-white border-y border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-300">736,497+</div>
              <div className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">MSME Enterprises Benchmarked</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-300">10,455</div>
              <div className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">Telangana Villages Georeferenced</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-300">33 / 33</div>
              <div className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">Districts Competition Mapped</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-300">90%</div>
              <div className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">Concessional Loan Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              End-to-End Decision Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-4 tracking-tight">
              Everything You Need to Launch a Sustainable MSME
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Built on verified government datasets and algorithmic geospatial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition bg-white group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Hyper-Local Business Discovery</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Matches your capital, location, and skills with high-opportunity sectors. Calculates Opportunity, Competition, and Risk scores tailored to your village.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition bg-white group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Financial Structuring</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Calculates total project cost, concessional scheme routing, monthly/quarterly EMIs, break-even timelines, and multi-year cash reserve forecasts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition bg-white group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">PostGIS Radius Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Calculates exact 5 km, 10 km, and 20 km metric trade corridors, counting neighbor villages, reachable customer demographics, and competitor density.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition bg-white group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5 group-hover:bg-purple-600 group-hover:text-white transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI SWOT with Causal Reasoning</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Explains explicitly WHY each strength, weakness, opportunity, and threat exists based on local mandal economics, agricultural output, and power infrastructure.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition bg-white group">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-5 group-hover:bg-rose-600 group-hover:text-white transition">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Market Gap & Saturation Index</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Identifies underserved rural product segments (dairy value-addition, mini dal milling) versus oversaturated commodities (basic kirana, unspecialized shops).
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition bg-white group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Downloadable Bank Feasibility Report</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generates a clean, multi-page PDF incorporating project appraisal, EMI schedules, geospatial maps, and checklist of documents for state loan channelizers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Workflow */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-100/60 px-3 py-1 rounded-full border border-emerald-200">
              User Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-4 tracking-tight">
              4 Steps from Discovery to Concessional Funding
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4">1</span>
              <h4 className="font-bold text-base text-slate-900 mb-1.5">Select District & Village</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Choose from 33 Telangana districts and 10,455 revenue villages with census-accurate centroids.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4">2</span>
              <h4 className="font-bold text-base text-slate-900 mb-1.5">Enter Margin Capital</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Input your self-funded equity (e.g., ₹1 Lakh) to automatically unlock 10x project cost eligibility.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4">3</span>
              <h4 className="font-bold text-base text-slate-900 mb-1.5">Review AI Advisory</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Compare Opportunity scores, examine competitor density heatmaps, and read causal SWOT points.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4">4</span>
              <h4 className="font-bold text-base text-slate-900 mb-1.5">Download Bank PDF</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Export the complete project report with EMI schedules to apply at district channelizing agencies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-600 mt-2 text-sm">Everything you need to know about the platform and concessional loans.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden transition">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180 text-emerald-600" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-5 text-sm text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-14 pb-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
                <Building2 className="w-5 h-5 text-emerald-400" /> GramVikas AI
              </div>
              <p className="leading-relaxed text-slate-400">
                AI-Driven Hyper-Local Business Advisory & Concessional Financial Structuring Platform for Rural Micro-Entrepreneurs.
              </p>
              <div className="mt-3 text-emerald-400 font-semibold">
                Smart India Hackathon 2026
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white mb-3 text-sm">Modules</h5>
              <ul className="space-y-2">
                <li><Link href="/dashboard/advisory" className="hover:text-emerald-400 transition">Business Recommendation</Link></li>
                <li><Link href="/dashboard/swot" className="hover:text-emerald-400 transition">AI SWOT Analysis</Link></li>
                <li><Link href="/dashboard/finance" className="hover:text-emerald-400 transition">Financial Planner</Link></li>
                <li><Link href="/dashboard/schemes" className="hover:text-emerald-400 transition">Scheme Finder</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-3 text-sm">GIS & Intelligence</h5>
              <ul className="space-y-2">
                <li><Link href="/dashboard/map" className="hover:text-emerald-400 transition">Interactive Village Map</Link></li>
                <li><Link href="/dashboard/radius" className="hover:text-emerald-400 transition">Radius Analysis (5-20 km)</Link></li>
                <li><Link href="/dashboard/market-gap" className="hover:text-emerald-400 transition">Market Gap Analysis</Link></li>
                <li><Link href="/dashboard/ai-chat" className="hover:text-emerald-400 transition">Gemini AI Assistant</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-3 text-sm">Organization</h5>
              <p className="leading-relaxed mb-3">
                Ministry of Social Justice and Empowerment (MoSJE)<br />
                Theme: Agriculture, FoodTech & Rural Development<br />
                Problem ID: 26091
              </p>
              <Link
                href="/dashboard/admin"
                className="inline-block px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                Access Admin Portal
              </Link>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p>© 2026 GramVikas AI. Designed for grassroots entrepreneurs across India.</p>
            <p className="text-slate-500">Built with Next.js 15, FastAPI, PostGIS, and Google Gemini API.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

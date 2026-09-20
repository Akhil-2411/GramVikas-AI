"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  FileSpreadsheet,
  Calculator,
  Award,
  MapPin,
  Radar,
  TrendingUp,
  BarChart3,
  BotMessageSquare,
  FileText,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  Building2,
  Search,
  Globe,
  Bell
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { translations } from "@/lib/translations";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    user,
    logout,
    district,
    mandal,
    village,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery
  } = useAppStore();

  const t = translations[language];

  const navItems = [
    { href: "/dashboard", label: t.dashboard, icon: LayoutDashboard },
    { href: "/dashboard/advisory", label: t.advisory, icon: Compass },
    { href: "/dashboard/swot", label: t.swot, icon: FileSpreadsheet },
    { href: "/dashboard/finance", label: t.finance, icon: Calculator },
    { href: "/dashboard/schemes", label: t.schemes, icon: Award },
    { href: "/dashboard/map", label: t.map, icon: MapPin },
    { href: "/dashboard/radius", label: t.radius, icon: Radar },
    { href: "/dashboard/market-gap", label: t.marketGap, icon: TrendingUp },
    { href: "/dashboard/district", label: t.districtAnalytics, icon: BarChart3 },
    { href: "/dashboard/ai-chat", label: t.aiChat, icon: BotMessageSquare, badge: "AI" },
    { href: "/dashboard/reports", label: t.reports, icon: FileText },
    ...(user?.role === "admin" ? [{ href: "/dashboard/admin", label: t.admin, icon: Shield }] : []),
    { href: "/dashboard/profile", label: t.profile, icon: User },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/map?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 z-30 shrink-0 select-none">
        {/* Brand Header */}
        <div className="h-18 flex items-center px-6 border-b border-slate-100 gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <Link href="/" className="font-extrabold text-lg tracking-tight text-slate-900 block">
              GramVikas <span className="text-emerald-600">AI</span>
            </Link>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
              MoSJE SIH 2026
            </span>
          </div>
        </div>

        {/* Current Active Location Context Badge */}
        <div className="px-4 py-3 bg-emerald-50/70 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="truncate">
            <span className="font-bold block truncate">{district}</span>
            <span className="text-[10px] text-emerald-600 block truncate">
              {mandal ? `${mandal} • ` : ""}{village || "All Villages"}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/25"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white text-emerald-700" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer User Info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-800 block truncate">{user?.full_name || "Entrepreneur"}</span>
                <span className="text-[10px] text-slate-400 capitalize block truncate">{user?.role || "user"}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-20">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Global Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full max-w-md hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search village, mandal, district or category..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
            </form>
          </div>

          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border border-slate-200 p-1 bg-slate-50 text-xs font-semibold">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 rounded transition ${language === "en" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("te")}
                className={`px-2 py-0.5 rounded transition ${language === "te" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"}`}
              >
                తె
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-2 py-0.5 rounded transition ${language === "hi" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"}`}
              >
                हि
              </button>
            </div>

            <Link
              href="/dashboard/ai-chat"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
            >
              <BotMessageSquare className="w-4 h-4 text-emerald-600" />
              Ask AI Advisor
            </Link>
          </div>
        </header>

        {/* Mobile Slide-out Menu */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 flex">
            <div className="w-64 bg-white h-full flex flex-col p-4 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-bold text-slate-900">GramVikas AI</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                      pathname === item.href ? "bg-emerald-600 text-white" : "text-slate-600"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-1" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        {/* Dashboard Main Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

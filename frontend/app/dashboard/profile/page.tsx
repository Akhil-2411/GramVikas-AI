"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Globe,
  MapPin,
  CheckCircle2,
  Save,
  Building2,
  AlertCircle
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { updateUserProfile } from "@/lib/api";

export default function ProfilePage() {
  const { user, district, language, setLanguage, updateUserProfile: storeUpdateUser } = useAppStore();
  const [fullName, setFullName] = useState(user?.full_name || "Ramesh Kumar");
  const [phone, setPhone] = useState(user?.phone || "+91 98480 22334");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updated = await updateUserProfile({
        full_name: fullName,
        phone,
        language,
      });
      storeUpdateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      // If offline, still update client store gracefully
      storeUpdateUser({
        id: user?.id || "local-user",
        full_name: fullName,
        email: user?.email || "demo@gramvikas.ai",
        role: user?.role || "entrepreneur",
        language,
        phone,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Entrepreneur Profile & Preferences</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your beneficiary account details, language, and default district focus.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xl flex items-center justify-center border-2 border-emerald-300">
              {fullName ? fullName.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">{fullName}</h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                {user?.role || "Entrepreneur"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  disabled
                  value={user?.email || "demo@gramvikas.ai"}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Interface Language</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
                >
                  <option value="en">English</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
            >
              <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Lock, Mail, User, Phone, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAppStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("entrepreneur");
  const [language, setLanguage] = useState("English");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { signupUser } = await import("@/lib/api");
      const data = await signupUser({
        full_name: fullName,
        email,
        password,
        phone,
        role,
        language,
      });

      setAuth(data.access_token, data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-600 text-white items-center justify-center shadow-lg shadow-emerald-600/30 mb-3">
          <Building2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Entrepreneur Account</h2>
        <p className="text-xs text-slate-500 mt-1">Access AI advisory and 90% concessional credit structuring</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Ramesh Kumar"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="ramesh@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="+91 98480 22334"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="admin">MoSJE Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option value="English">English</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition"
            >
              {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-600 font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

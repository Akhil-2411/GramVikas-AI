"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Lock, Mail, ArrowRight, Shield, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { loginUser, demoLogin, googleLoginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAppStore();
  const [email, setEmail] = useState("demo@gramvikas.ai");
  const [password, setPassword] = useState("Demo@1234");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email, password });
      setAuth(data.access_token, data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: "entrepreneur" | "admin") => {
    setDemoLoading(role);
    setError("");
    try {
      const data = await demoLogin(role);
      setAuth(data.access_token, data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Demo login failed. Ensure backend server is running.");
    } finally {
      setDemoLoading(null);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const data = await googleLoginUser({
        email: "entrepreneur.demo@gmail.com",
        name: "Ramesh Kumar (Google)",
      });
      setAuth(data.access_token, data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google authentication failed.");
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
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign in to GramVikas AI</h2>
        <p className="text-xs text-slate-500 mt-1">Ministry of Social Justice & Empowerment (MoSJE)</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo 1-Click Access Buttons */}
          <div className="mb-6 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>1-Click Evaluator & Demo Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("entrepreneur")}
                disabled={Boolean(demoLoading)}
                className="py-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm transition text-center"
              >
                {demoLoading === "entrepreneur" ? "Connecting..." : "Demo Entrepreneur"}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                disabled={Boolean(demoLoading)}
                className="py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold shadow-sm transition text-center flex items-center justify-center gap-1"
              >
                <Shield className="w-3 h-3 text-amber-400" />
                <span>{demoLoading === "admin" ? "Connecting..." : "MoSJE Admin"}</span>
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition"
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="mt-4 w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google Account
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              New to the platform?{" "}
              <Link href="/signup" className="text-emerald-600 font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

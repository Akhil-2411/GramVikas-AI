"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Lock, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import { confirmPasswordReset } from "@/lib/api";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading password reset form...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenParam);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!token.trim()) {
      setError("Reset token is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await confirmPasswordReset(token.trim(), password);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      setError(err.message || "Invalid or expired reset token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-600 text-white items-center justify-center shadow-lg mb-3">
          <Building2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Set New Password</h2>
        <p className="text-xs text-slate-500 mt-1">Enter your recovery token and choose a secure password</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">Password Updated</h3>
              <p className="text-xs text-slate-600">Your account password was updated successfully. Redirecting to login...</p>
              <Link href="/login" className="inline-block mt-3 text-xs font-bold text-emerald-600 hover:underline">
                Go to Sign In Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reset Token</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                    placeholder="Paste reset token here"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition"
              >
                {loading ? "Updating Password..." : "Confirm Password Change"} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs text-slate-500 hover:underline">
                  Return to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

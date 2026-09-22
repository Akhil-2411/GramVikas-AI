"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building2, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { requestPasswordReset } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await requestPasswordReset(email);
      setSubmitted(true);
      if (res.reset_token) {
        setResetToken(res.reset_token);
      }
    } catch (err: any) {
      setError(err.message || "Failed to process password reset request.");
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
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reset Your Password</h2>
        <p className="text-xs text-slate-500 mt-1">Enter your registered email to receive recovery instructions</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {submitted ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">Recovery Token Generated</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instructions have been generated for <b>{email}</b>.
              </p>

              {resetToken && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Fast Demo Link (Token Active)
                  </span>
                  <Link
                    href={`/reset-password?token=${encodeURIComponent(resetToken)}`}
                    className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold hover:underline"
                  >
                    Click to proceed with password reset <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              <div className="pt-3">
                <Link
                  href="/login"
                  className="inline-block text-xs text-slate-500 font-bold hover:underline"
                >
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition"
              >
                {loading ? "Issuing Token..." : "Send Reset Link"} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs text-slate-500 hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

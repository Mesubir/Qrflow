"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QrCode, Mail, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate sending email reset link
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1200);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#09090b] text-[#fafafa] relative overflow-hidden px-4">
      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-650/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-md p-8 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-all">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
              QRFlow
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Reset Password</h1>
          <p className="text-zinc-400 text-sm">
            {!submitted
              ? "Enter your email address and we'll send you a link to reset your password."
              : "Check your inbox! We've sent a password reset link to your email."}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-450 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-650 focus:border-transparent transition-all"
                />
                <Mail className="w-4 h-4 text-zinc-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-purple-600/20"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4 bg-purple-950/10 border border-purple-500/20 rounded-2xl mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
            <h3 className="font-semibold text-white text-base mb-1">Reset Link Sent</h3>
            <p className="text-xs text-zinc-400">
              Please click the link in the email sent to <span className="font-semibold text-zinc-300">{email}</span> to set up a new password.
            </p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

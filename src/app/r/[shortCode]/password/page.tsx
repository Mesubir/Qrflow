"use client";

import React, { useState } from "react";
import { Lock, AlertCircle, ArrowRight } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function QRPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shortCode = params.shortCode as string;

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Direct redirect with the password parameter
      const nextQuery = searchParams.get("next") || "";
      const originalParams = new URLSearchParams(nextQuery);
      originalParams.set("pwd", password);
      
      router.push(`/r/${shortCode}?${originalParams.toString()}`);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#09090b] text-[#fafafa] relative overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-md p-8 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-purple-600/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-4 animate-pulse">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Password Protected</h1>
          <p className="text-zinc-400 text-sm">
            This QR code destination is password protected. Enter the password below to access the destination link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/20 border border-red-500/20 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-purple-600/25"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Access Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-500">
            Powered by <span className="font-bold text-zinc-400">QRFlow</span>
          </p>
        </div>
      </div>
    </main>
  );
}

"use client";

import React, { Suspense } from "react";
import { AlertTriangle, Clock, RefreshCw, ShieldAlert, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function StatusContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "paused";
  const qrName = searchParams.get("name") || "Untitled QR Code";

  // Resolve styles and icon based on status types
  let title = "QR Code Inactive";
  let description = "This QR code is currently inactive. Please check again later or contact the owner.";
  let icon = <AlertTriangle className="w-8 h-8 text-amber-400" />;
  let bgColorClass = "bg-amber-500/10 border-amber-500/20";
  let textGradClass = "from-amber-400 to-orange-500";

  if (type === "paused") {
    title = "QR Code Paused";
    description = `The QR code "${qrName}" has been temporarily paused by its owner. It will be accessible once it is resumed.`;
    icon = <Clock className="w-8 h-8 text-yellow-400 animate-pulse" />;
    bgColorClass = "bg-yellow-500/10 border-yellow-500/20";
    textGradClass = "from-yellow-400 to-amber-500";
  } else if (type === "expired") {
    title = "QR Code Expired";
    description = `The QR code "${qrName}" has expired. It reached its end date and is no longer redirecting traffic.`;
    icon = <ShieldAlert className="w-8 h-8 text-red-400" />;
    bgColorClass = "bg-red-500/10 border-red-500/20";
    textGradClass = "from-red-400 to-rose-600";
  } else if (type === "limit") {
    title = "Scan Limit Reached";
    description = `The QR code "${qrName}" has reached its maximum scan limit allowed by the owner's current plan.`;
    icon = <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin-slow" style={{ animationDuration: "10s" }} />;
    bgColorClass = "bg-indigo-500/10 border-indigo-500/20";
    textGradClass = "from-indigo-400 to-purple-500";
  }

  return (
    <div className="w-full max-w-lg p-8 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl relative z-10">
      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-6 ${bgColorClass}`}>
          {icon}
        </div>
        
        <h1 className={`text-3xl font-extrabold tracking-tight bg-gradient-to-r ${textGradClass} bg-clip-text text-transparent mb-4`}>
          {title}
        </h1>
        
        <p className="text-zinc-400 text-base leading-relaxed mb-8">
          {description}
        </p>

        <div className="w-full pt-6 border-t border-zinc-800 flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-3 px-4 bg-zinc-850 hover:bg-zinc-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 border border-zinc-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to QRFlow Home</span>
          </Link>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-zinc-500">
          Powered by <span className="font-bold text-zinc-400">QRFlow</span>
        </p>
      </div>
    </div>
  );
}

export default function QRStatusPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#09090b] text-[#fafafa] relative overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-zinc-600/5 rounded-full blur-[130px] pointer-events-none" />
      
      <Suspense fallback={
        <div className="text-center text-zinc-400">Loading status information...</div>
      }>
        <StatusContent />
      </Suspense>
    </main>
  );
}

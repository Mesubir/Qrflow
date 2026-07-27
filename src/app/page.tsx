"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveQRGenerator from "@/components/marketing/LiveQRGenerator";
import Link from "next/link";
import {
  Zap,
  BarChart3,
  Globe2,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Check,
  QrCode,
  Users,
  ChevronDown,
} from "lucide-react";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What is the difference between Static and Dynamic QR Codes?",
      a: "Static QR codes encode the data directly in the matrix itself, meaning once generated, the information cannot be edited. Dynamic QR codes route through a redirection link (e.g. qrflow.com/r/ABC123) which lets you update the destination URL unlimited times in the future without changing the printed QR image.",
    },
    {
      q: "Do the printed QR codes ever expire?",
      a: "Static QR codes generated with QRFlow are 100% free, have no scan limits, and never expire. Dynamic QR codes are active as long as your subscription is active, and can be paused or scheduled to expire on specific dates.",
    },
    {
      q: "Can I track scans in real-time?",
      a: "Yes! For Dynamic QR codes, we track every scan in real-time. Our dashboard reports total scans, unique visitors, browser user-agents, operating systems, and geographical locations (down to cities) using an interactive world map.",
    },
    {
      q: "Can I connect my own custom branded domains?",
      a: "Absolutely! Our Business and Enterprise plans allow you to connect custom short domains (e.g., scan.mybrand.co) so that your dynamic redirects carry your brand name instead of qrflow.com.",
    },
    {
      q: "How does the custom password protection work?",
      a: "When editing a dynamic QR code, you can set a access password. When visitors scan the code, they are prompted by a secure glassmorphic page to verify the password before being redirected to the target link.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#09090b] transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-24 overflow-hidden">
          {/* Radial BG glows */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 dark:bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Announcement badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400 text-xs font-semibold mb-8 animate-fade-in">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Version 2.0 is Live: Custom Frames & Eye Shapes</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] max-w-4xl mx-auto mb-6">
              Generate QR Codes That You Can{" "}
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Update Anytime.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-550 dark:text-zinc-400 max-w-2xl mx-auto mb-16 leading-relaxed">
              Create gorgeous, customized QR codes once. Change the destination URL anytime without changing the printed image. Track deep real-time analytics.
            </p>

            {/* Interactive Tool Widget */}
            <div className="mb-24">
              <LiveQRGenerator />
            </div>
          </div>
        </section>

        {/* VALUE PROPOSITION COMPARISON */}
        <section id="how-it-works" className="py-20 border-t border-zinc-200/50 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
                The Core USP: Static vs. Dynamic
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                Stop re-printing materials every time your URL changes. Discover the flexibility of QRFlow dynamic routing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Static Card */}
              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-250/60 dark:border-zinc-800 p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-650 dark:text-zinc-350 mb-6">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-zinc-900 dark:text-white mb-2">Static QR Codes</h3>
                  <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                    Data is hardcoded inside the QR image itself. Once printed, you can never change where it redirects or what it contains.
                  </p>
                  <ul className="space-y-3 text-sm text-zinc-500 mb-8">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 100% Free Forever</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Ideal for WiFi, vCard, or SMS</li>
                    <li className="flex items-center gap-2 text-red-500/80"><span className="text-lg leading-none font-bold">×</span> No Analytics or Scan Metrics</li>
                    <li className="flex items-center gap-2 text-red-500/80"><span className="text-lg leading-none font-bold">×</span> Cannot edit target destination link</li>
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="py-2.5 w-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-900 dark:text-white text-center font-semibold rounded-xl text-sm transition-all"
                >
                  Create Static Free
                </Link>
              </div>

              {/* Dynamic Card */}
              <div className="bg-white dark:bg-zinc-900/40 border-2 border-purple-500/30 p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-lg glow-purple">
                <div className="absolute top-0 right-0 bg-purple-600 text-white font-bold text-3xs px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                  Highly Recommended
                </div>
                <div>
                  <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-zinc-900 dark:text-white mb-2">Dynamic QR Codes</h3>
                  <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                    Routes scans through a short link container. Change the final destination URL millions of times in the future. The image never changes.
                  </p>
                  <ul className="space-y-3 text-sm text-zinc-500 mb-8">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Update Destination URL unlimited times</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Detailed scan locations & device analytics</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Advanced rules (device, country matching)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Password protection & expiry controls</li>
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="py-2.5 w-full bg-purple-600 hover:bg-purple-500 text-white text-center font-semibold rounded-xl text-sm transition-all shadow-md shadow-purple-600/20"
                >
                  Get Started with Dynamic
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
              Designed for Marketing, Built for Scale
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              QRFlow combines a premium visual customizer with a high-performance redirection router and deep data capture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
                title: "Deep Geo-Analytics",
                desc: "Monitor scans, unique clicks, repeat visits, OS types, browser categories, and country/city coordinates on an interactive global map.",
              },
              {
                icon: <Globe2 className="w-6 h-6 text-blue-400" />,
                title: "Advanced Redirect Rules",
                desc: "Send users to different links depending on their device type (iOS/Android), country location, language settings, or randomly distribute traffic.",
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
                title: "Security & Expiry",
                desc: "Secure QR codes with passwords, set them to expire automatically on specific dates, or cap them at maximum total scan limits.",
              },
              {
                icon: <FolderOpen className="w-6 h-6 text-yellow-400" />,
                title: "Folders & Campaigns",
                desc: "Organize codes into dedicated client folders, group them inside dynamic campaigns, and generate consolidated marketing reports.",
              },
              {
                icon: <Users className="w-6 h-6 text-indigo-400" />,
                title: "Team Collaborations",
                desc: "Invite members to workspaces. Set strict role permissions (Admin, Editor, Viewer) and track changes with detailed action audit logs.",
              },
              {
                icon: <Zap className="w-6 h-6 text-pink-400" />,
                title: "Developer APIs & Keys",
                desc: "Integrate QR generation directly into your workflows. Generate keys, deploy webhooks, and sync data automatically with Make/Zapier.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-850 flex items-center justify-center mb-6 group-hover:scale-105 transition-all">
                  {f.icon}
                </div>
                <h3 className="font-heading font-bold text-lg text-zinc-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-zinc-550 dark:text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-20 border-t border-zinc-200/50 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                Choose the plan that fits your business needs. Upgrade, downgrade, or cancel anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {[
                {
                  name: "Free Plan",
                  price: "₹0",
                  desc: "Essential static QR codes",
                  features: [
                    "Unlimited Static QR Codes",
                    "Custom colors & style adjustments",
                    "High-resolution SVG & PNG downloads",
                    "No expiration or scan limits"
                  ],
                  cta: "Get Started Free",
                  pop: false,
                },
                {
                  name: "Premium Plan",
                  price: "₹299",
                  period: "/mo",
                  desc: "All dynamic features & analytics",
                  features: [
                    "Unlimited Dynamic QR Codes",
                    "Edit destination URLs anytime",
                    "Advanced redirects (Country/Device)",
                    "Deep geo-analytics & tracking",
                    "Scan limits & expiration dates",
                    "Password protection & white labeling",
                    "24/7 Priority support"
                  ],
                  cta: "Upgrade to Premium",
                  pop: true,
                },
              ].map((p, i) => (
                <div
                  key={i}
                  className={`bg-white dark:bg-zinc-900/50 border rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden transition-all ${
                    p.pop
                      ? "border-purple-500 shadow-xl shadow-purple-500/5 ring-1 ring-purple-500/25"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  {p.pop && (
                    <div className="absolute top-0 right-0 bg-purple-600 text-white font-bold text-4xs px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                      Best Value
                    </div>
                  )}
                  <div>
                    <h3 className="font-heading font-bold text-xl text-zinc-900 dark:text-white mb-2">{p.name}</h3>
                    <p className="text-zinc-400 text-xs mb-6">{p.desc}</p>
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold text-zinc-900 dark:text-white">{p.price}</span>
                      {p.period && <span className="text-zinc-550 text-sm ml-1">{p.period}</span>}
                    </div>
                    <ul className="space-y-4 mb-8">
                      {p.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-xs text-zinc-500">
                          <Check className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/signup"
                    className={`w-full py-3 font-bold text-xs rounded-xl text-center transition-all cursor-pointer ${
                      p.pop
                        ? "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/10"
                        : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-900 dark:text-white"
                    }`}
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section id="faqs" className="py-20 max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Clear answers to common questions about setting up and using QRFlow.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full py-4 px-6 flex items-center justify-between font-heading font-semibold text-left text-zinc-900 dark:text-white text-base hover:bg-zinc-50 dark:hover:bg-zinc-850/30 transition-all cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 transition-transform ${
                      activeFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === i && (
                  <div className="py-4 px-6 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

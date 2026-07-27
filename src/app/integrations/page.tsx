import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Integrations | QRFlow",
  description: "Connect QRFlow dynamic QR codes to your favorite marketing, analytics, and automation tools.",
};

export default function IntegrationsPage() {
  const integrations = [
    { name: "Zapier", desc: "Trigger workflows in thousands of apps when a QR code gets scanned.", category: "Automation" },
    { name: "Shopify", desc: "Embed custom discount QRs into package slips and track physical conversions.", category: "E-Commerce" },
    { name: "Google Sheets", desc: "Sync real-time scan event logs, timestamps, and locations directly to sheets.", category: "Analytics" },
    { name: "Slack", desc: "Get instant notifications in your Slack channels for critical QR code scan updates.", category: "Communication" },
    { name: "HubSpot", desc: "Feed scanned lead details and location telemetry straight into your HubSpot CRM.", category: "CRM" },
    { name: "Custom Webhooks", desc: "Receive automated POST requests on your server endpoints for every scan event.", category: "Developer" },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between selection:bg-purple-500/30">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-16 sm:mb-20">
          <span className="text-3xs font-extrabold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
            Integrations
          </span>
          <h1 id="integrations-title" className="text-4xl sm:text-5xl font-extrabold font-heading tracking-tight mt-6 mb-6 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Connect your physical marketing channels with the software you love.
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl mx-auto">
            Sync scan events, customer locations, and conversion goals seamlessly with popular services, database tools, or your custom server integrations.
          </p>
        </div>

        {/* Grid Section */}
        <div className="max-w-5xl mx-auto px-4 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {integrations.map((item, idx) => (
              <div key={idx} className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-800 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-4xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <Link2 className="w-4 h-4 text-zinc-550 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">{item.name}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-6">{item.desc}</p>
                </div>
                <button className="text-3xs font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer mt-auto">
                  <span>Learn integration</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold font-heading text-white mb-3">Need a custom integration?</h2>
          <p className="text-zinc-400 text-xs mb-6 max-w-md mx-auto">
            Our Premium plan supports full API access and real-time custom webhooks to support any developer workflow.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center py-2.5 px-6 bg-purple-650 hover:bg-purple-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-650/15 transition-all"
            id="integrations-cta-btn"
          >
            Contact Developer Team
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}

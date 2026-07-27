import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | QRFlow",
  description: "Review QRFlow's data collection, tracking, storage, and privacy procedures.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between selection:bg-purple-500/30">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 max-w-4xl mx-auto px-4">
        <span className="text-3xs font-extrabold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
          Legal
        </span>
        
        <h1 id="privacy-title" className="text-4xl font-extrabold font-heading tracking-tight mt-6 mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-zinc-500 text-3xs mb-8">Last Updated: July 27, 2026</p>

        <div className="prose prose-invert prose-zinc text-zinc-400 text-xs leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-heading text-white">1. Information We Collect</h2>
            <p>
              At QRFlow, we collect information necessary to operate, optimize, and secure our dynamic QR code services. This includes user account data (such as email address and billing preferences) and campaign assets (such as target URLs and metadata configurations).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-heading text-white">2. Redirection Telemetry Data</h2>
            <p>
              For dynamic QR code redirects, we process technical access data including device type (mobile, tablet, desktop), operating system (iOS, Android, Windows, macOS), coarse geolocation indicators (country/region level derived from IP), and timestamps. This data is collected solely to compile real-time tracking analytics for QR code owners. We do not store raw IP addresses permanently, nor do we track users across unrelated websites.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-heading text-white">3. Third-party Billing & Services</h2>
            <p>
              All payments are processed securely by Stripe or mock billing processors. We do not store raw credit card details on our local database. Analytics integrations or third-party webhooks are executed directly under configurations defined by the account owner.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-heading text-white">4. Cookies & Persistent Tokens</h2>
            <p>
              We use temporary cookies and session tokens to preserve dashboard states, authentication tokens, and styling preferences (such as light or dark themes). You can manage cookie rules through your standard web browser configurations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-heading text-white">5. Contact Support</h2>
            <p>
              For further inquiries, compliance requests, or questions regarding account telemetry deletion, please contact us at support@qrflow.com.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

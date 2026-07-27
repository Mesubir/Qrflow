import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service | QRFlow",
  description: "Read QRFlow's terms of service, platform usage requirements, and dynamic redirect agreements.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between selection:bg-purple-500/30">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 max-w-4xl mx-auto px-4">
        <span className="text-3xs font-extrabold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
          Legal
        </span>
        
        <h1 id="terms-title" className="text-4xl font-extrabold font-heading tracking-tight mt-6 mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-zinc-550 text-3xs mb-8">Last Updated: July 27, 2026</p>

        <div className="prose prose-invert prose-zinc text-zinc-400 text-xs leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-heading text-white">1. Platform Acceptance</h2>
            <p>
              By signing up for or using the QRFlow platform, website, dynamic redirection networks, or customized generator widgets, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-heading text-white">2. Acceptable Platform Use</h2>
            <p>
              You agree to use QRFlow solely for legitimate advertising, styling, and scan routing purposes. Creating codes that route to phishing, malware, spam, explicit/violent pages, or illegal activities is strictly prohibited and will lead to immediate account suspension and deletion without refunds.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-heading text-white">3. Billing, Subscriptions, & Refund Rules</h2>
            <p>
              Paid subscription plans are billed monthly on a recurring basis. You can cancel or edit your plan at any time through the billing dashboard. Refunds are governed under our standard customer SLA rules. Legacy codes created on free or expired plans may be deactivated if they breach limits.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-heading text-white">4. Service Uptime & Limitation of Liability</h2>
            <p>
              QRFlow guarantees a 99.99% redirect network availability SLA. However, we are not liable for business interruptions, loss of redirect data, or analytics errors arising from external DNS issues, cellular networks, or client domain errors.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-heading text-white">5. Governing Agreement Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the platform following updates represents your binding acceptance of the revised Terms of Service.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

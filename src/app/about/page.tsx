import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Sparkles, Zap, Heart } from "lucide-react";

export const metadata = {
  title: "About Us | QRFlow",
  description: "Learn about QRFlow's mission to simplify dynamic QR code redirection, styling, and scan analytics.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between selection:bg-purple-500/30">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-16 sm:mb-24">
          <span className="text-3xs font-extrabold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
            Our Mission
          </span>
          <h1 id="about-title" className="text-4xl sm:text-5xl font-extrabold font-heading tracking-tight mt-6 mb-6 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Bridging the gap between physical connections and digital intelligence.
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            QRFlow was born out of a simple need: to make QR codes dynamic, stylized, and trackable. We believe that every scan represents a moment of connection, and we build tools to make that moment beautiful and informative.
          </p>
        </div>

        {/* Core Values */}
        <div className="max-w-6xl mx-auto px-4 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Sparkles className="w-5 h-5 text-purple-400" />,
                title: "Aesthetics First",
                desc: "We don't do boring black-and-white. Every QR code generated on our platform is a piece of art.",
              },
              {
                icon: <Zap className="w-5 h-5 text-blue-400" />,
                title: "Real-time Speed",
                desc: "Our globally distributed redirection network routes users to their destinations in milliseconds.",
              },
              {
                icon: <Shield className="w-5 h-5 text-emerald-400" />,
                title: "Privacy & Trust",
                desc: "We respect data privacy and comply with regulations, providing safe and secure redirects.",
              },
              {
                icon: <Heart className="w-5 h-5 text-pink-400" />,
                title: "Customer Centric",
                desc: "We build features based directly on user feedback, ensuring our platform matches your daily workflow.",
              },
            ].map((val, idx) => (
              <div key={idx} className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-800 transition-all">
                <div className="w-10 h-10 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {val.icon}
                </div>
                <h3 className="font-bold text-base text-white mb-2">{val.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold font-heading text-white mb-4">Interested in what we are building?</h2>
          <p className="text-zinc-400 text-xs mb-6 max-w-xl mx-auto">
            Get started today and experience the difference of premium design systems combined with actionable analytics.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center justify-center py-2.5 px-6 bg-purple-650 hover:bg-purple-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-650/15 transition-all"
            id="about-cta-btn"
          >
            Create Your Account
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}

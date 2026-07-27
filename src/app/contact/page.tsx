import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageSquare, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Contact Support | QRFlow",
  description: "Get in touch with the QRFlow customer support and digital marketing advisory team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between selection:bg-purple-500/30">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Info Card */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <span className="text-3xs font-extrabold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
                Get In Touch
              </span>
              <h1 id="contact-title" className="text-4xl font-extrabold font-heading tracking-tight mt-6 mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                How can we assist you today?
              </h1>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Have questions about pricing, setup, analytics tracking, or enterprise branding rules? Drop us a message, and our team will get back to you within 12 hours.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-start bg-zinc-900/30 border border-zinc-850 p-4 rounded-xl">
                <Mail className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-white">General Support</h4>
                  <p className="text-zinc-450 text-3xs mt-0.5">support@qrflow.com</p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-zinc-900/30 border border-zinc-850 p-4 rounded-xl">
                <MessageSquare className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-white">Enterprise Consultation</h4>
                  <p className="text-zinc-450 text-3xs mt-0.5">enterprise@qrflow.com</p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-zinc-900/30 border border-zinc-850 p-4 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-white">SLA & Platform Uptime</h4>
                  <p className="text-zinc-455 text-3xs mt-0.5">99.99% redirect availability SLA guaranteed.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="md:col-span-7 bg-zinc-900/30 border border-zinc-850 p-6 sm:p-8 rounded-2xl relative overflow-hidden">
            <h3 className="font-heading font-bold text-lg text-white mb-6">Send Support Message</h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-3xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-650"
                  />
                </div>
                <div>
                  <label className="text-3xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-650"
                  />
                </div>
              </div>

              <div>
                <label className="text-3xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="How can we help?"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-650"
                />
              </div>

              <div>
                <label className="text-3xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">Message Description</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us what you need support with..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-650 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-650 hover:bg-purple-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-650/15 cursor-pointer text-center"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

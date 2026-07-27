import React from "react";
import Link from "next/link";
import { QrCode } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/40 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white">
                <QrCode className="w-4.5 h-4.5" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
                QRFlow
              </span>
            </div>
            <p className="text-zinc-550 dark:text-zinc-400 text-sm leading-relaxed">
              The premium dynamic QR code generator built for modern businesses, marketers, and developers. Track scan details, adjust destination URLs, and customize brand aesthetics effortlessly.
            </p>
            <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-600">
              <Link href="#" className="hover:text-purple-500" aria-label="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </Link>
              <Link href="#" className="hover:text-purple-500" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link href="#" className="hover:text-purple-500" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="md:pl-8">
            <h3 className="font-heading font-semibold text-sm text-zinc-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-zinc-550">
              <li><Link href="/#features" className="hover:text-purple-500">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-purple-500">Pricing</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-purple-500">How It Works</Link></li>
              <li><Link href="/integrations" className="hover:text-purple-500">Integrations</Link></li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div className="md:pl-8">
            <h3 className="font-heading font-semibold text-sm text-zinc-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-zinc-550">
              <li><Link href="/about" className="hover:text-purple-500">About Us</Link></li>
              <li><Link href="/terms" className="hover:text-purple-500">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-purple-500">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-purple-500">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-900 text-center text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} QRFlow Inc. All rights reserved. Designed like Linear, Notion, and Vercel.</p>
        </div>
      </div>
    </footer>
  );
}

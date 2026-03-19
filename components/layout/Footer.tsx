"use client";

import Link from "next/link";
import { CATEGORIES, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { LogoIcon } from "./Navbar";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0d1619] text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Column 1: Brand — wider */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Auronex Media
              </span>
            </Link>
            <p className="mt-4 text-sm text-[#5A6269] max-w-xs">
              In-depth articles on accounting, payroll, tax, and compliance — built for UK business owners.
            </p>
            <p className="text-xs text-[#5A6269]">
              &copy; {currentYear} {SITE_NAME}. All rights reserved.
            </p>
          </div>

          {/* Column 2: Topics */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A0A8B0] mb-1">Topics</h3>
            <div className="flex flex-col gap-2.5">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="text-sm text-[#D0D4D8] hover:text-white transition-colors leading-snug"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Company */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A0A8B0] mb-1">Company</h3>
            <div className="flex flex-col gap-2.5">
              <Link href="/about" className="text-sm text-[#D0D4D8] hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="text-sm text-[#D0D4D8] hover:text-white transition-colors">Contact</Link>
              <Link href="/privacy" className="text-sm text-[#D0D4D8] hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-[#D0D4D8] hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>

          {/* Column 4: Stay Updated */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A0A8B0] mb-1">Stay Updated</h3>
            <p className="text-sm text-[#D0D4D8] leading-relaxed">
              One email when we publish. No spam, no sales pitches.
            </p>
            <form className="flex flex-col gap-2.5" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="bg-[#1a2328] border border-[#2a3338] text-white rounded-xl px-4 py-2.5 text-sm placeholder:text-[#5A6269] focus:outline-none focus:ring-1 focus:ring-[#037aff] transition-all"
                required
              />
              <button
                type="submit"
                className="bg-[#037aff] hover:bg-[#0260CC] text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors w-full"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1a2328]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#5A6269]">{SITE_TAGLINE}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-[#5A6269] hover:text-[#A0A8B0] transition-colors">Privacy</Link>
            <span className="text-[#2a3338]">·</span>
            <Link href="/terms" className="text-xs text-[#5A6269] hover:text-[#A0A8B0] transition-colors">Terms</Link>
            <span className="text-[#2a3338]">·</span>
            <Link href="/rss.xml" className="text-xs text-[#5A6269] hover:text-[#A0A8B0] transition-colors">RSS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

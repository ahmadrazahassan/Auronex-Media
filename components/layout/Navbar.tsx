"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu } from "lucide-react";
import { NAV_LINKS, CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 7h6" />
      <path d="M8 11h4" />
    </svg>
  );
}

export { LogoIcon };

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E2DFD8]">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display font-bold text-xl tracking-tight text-[#0d1619]">
              Auronex Media
            </span>
          </Link>

          {/* Center: Desktop Nav — all categories shown directly */}
          <nav className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[13px] font-medium transition-colors whitespace-nowrap ${
                  pathname === link.href
                    ? "text-[#037aff]"
                    : "text-[#5A6269] hover:text-[#0d1619]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right: Search & Mobile Menu */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" className="text-[#5A6269] hover:text-[#0d1619] hover:bg-[#F0EFEB] rounded-full">
              <Search className="w-5 h-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="lg:hidden text-[#0d1619]">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              } />
              <SheetContent side="right" className="bg-[#FAF9F6] border-l border-[#E2DFD8] p-6 w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-[#0d1619]">Home</Link>
                  <div className="border-t border-[#E2DFD8] pt-4 flex flex-col gap-3">
                    <span className="text-xs font-semibold text-[#5A6269] uppercase tracking-widest">Topics</span>
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/${cat.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="text-sm text-[#0d1619] hover:text-[#037aff] transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-[#E2DFD8] pt-4">
                    <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-[#0d1619]">About</Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

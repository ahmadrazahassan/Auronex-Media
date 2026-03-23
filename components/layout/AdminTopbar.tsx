"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

const adminLinks = [
  { name: "Articles", href: "/admin/articles" },
  { name: "Categories", href: "/admin/categories" },
  { name: "Subscribers", href: "/admin/subscribers" },
  { name: "Settings", href: "/admin/settings" },
];

export function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const shouldHide = currentY > 24 && currentY > lastY;
      setHidden(shouldHide);
      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className={cn("sticky top-0 z-40 w-full px-4 pt-4 transition-transform duration-300 md:px-6 md:pt-6", hidden ? "-translate-y-[150%]" : "translate-y-0")}>
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 rounded-[24px] border border-[#E2DFD8] bg-white p-2 shadow-[0_8px_32px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-hidden md:w-max md:gap-4 md:px-3 md:py-2.5">
        <Link href="/admin" className="mr-1 flex shrink-0 items-center gap-2 pl-2 pr-1 outline-none sm:mr-3 sm:pl-3 sm:pr-2">
          <span className="font-display text-[15px] font-bold tracking-tight text-[#0d1619] sm:block">
            SBD<span className="font-medium text-[#5A6269]">Admin</span>
          </span>
        </Link>

        <div className="h-5 w-px shrink-0 bg-[#E2DFD8]" />

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto no-scrollbar sm:flex-none">
          {adminLinks.map((link) => {
            const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(`${link.href}`));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap rounded-xl px-3.5 py-2 text-[14px] font-medium transition-all active:scale-95",
                  active
                    ? "bg-[#FAF9F6] text-[#0d1619] border border-[#E2DFD8] shadow-sm"
                    : "text-[#5A6269] hover:bg-[#FAF9F6] hover:text-[#0d1619]"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden h-5 w-px shrink-0 bg-[#E2DFD8] md:block" />

        <div className="hidden items-center gap-1 sm:flex">
          <Link href="/" target="_blank" className="rounded-xl px-3 py-2 text-[14px] font-medium text-[#5A6269] transition-all hover:bg-[#FAF9F6] hover:text-[#0d1619] active:scale-95">
            Site
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center justify-center rounded-xl p-2 text-[#5A6269] transition-all hover:bg-[#FAF9F6] hover:text-[#0d1619] active:scale-95"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>
    </div>
  );
}

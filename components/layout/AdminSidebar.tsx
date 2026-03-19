"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Tags, 
  Users, 
  Settings 
} from "lucide-react";
import { AdminAuthButton } from "@/components/admin/AdminAuthButton";
import { cn } from "@/lib/utils";

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Articles", href: "/admin/articles", icon: FileText },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Subscribers", href: "/admin/subscribers", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0d1619] h-screen flex flex-col fixed left-0 top-0 border-r border-[#1a2328]">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2 text-[#FAF9F6]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#FAF9F6]">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            <path d="M8 7h6" />
            <path d="M8 11h4" />
          </svg>
          <span className="font-display font-bold text-xl tracking-tight">Auronex<span className="font-medium text-[#A0A8B0]">Admin</span></span>
        </Link>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive 
                  ? "bg-[#037aff]/10 text-[#037aff]" 
                  : "text-[#A0A8B0] hover:text-white hover:bg-[#1a2328]"
              )}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1a2328]">
        <AdminAuthButton />
      </div>
    </aside>
  );
}

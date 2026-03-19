"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AdminAuthButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#A0A8B0] hover:text-white hover:bg-[#1a2328] transition-colors"
    >
      <LogOut className="w-5 h-5" />
      Sign out
    </button>
  );
}

"use client";

import { toast } from "sonner";
import type { Subscriber } from "@/types";

export function ExportSubscribersButton({ subscribers }: { subscribers: Subscriber[] }) {
  function handleExport() {
    const rows = [
      ["email", "subscribed", "created_at"],
      ...subscribers.map((subscriber) => [subscriber.email, String(subscriber.subscribed), subscriber.created_at]),
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `auronex-media-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Subscribers exported as CSV.");
  }

  return (
    <button type="button" onClick={handleExport} className="inline-flex h-[42px] items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border border-[#D9D4CB] bg-white px-5 text-[14px] font-medium text-[#0d1619] shadow-[0_1px_2px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all hover:border-[#CFC8BD] hover:bg-[#FDFCFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#037aff]/20 active:translate-y-[1px]">
      Export CSV
    </button>
  );
}

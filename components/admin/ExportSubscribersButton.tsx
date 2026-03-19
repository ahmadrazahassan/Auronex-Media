"use client";

import { toast } from "sonner";
import type { Subscriber } from "@/types";
import { Button } from "@/components/ui/button";

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
    <Button type="button" onClick={handleExport} className="h-[42px] rounded-[14px]">
      Export CSV
    </Button>
  );
}

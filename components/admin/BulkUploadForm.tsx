"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function BulkUploadForm() {
  const router = useRouter();
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(false);

  const parsed = useMemo(() => {
    if (!raw.trim()) {
      return { ok: false, value: "" };
    }
    return { ok: true, value: raw };
  }, [raw]);

  async function handleUpload() {
    if (!parsed.ok) {
      toast.error("Provide valid HTML content to import.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/articles/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: parsed.value }),
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || "Bulk upload failed.");
        setLoading(false);
        return;
      }

      toast.success(`${result.inserted} articles imported.`);
      router.push("/admin/articles");
      router.refresh();
    } catch {
      toast.error("Bulk upload failed.");
      setLoading(false);
    }
  }

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setRaw(text);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display font-bold text-3xl text-[#0d1619]">Import HTML</h1>
        <p className="text-[#5A6269] mt-1">Import a complete article from an HTML file or paste the HTML directly.</p>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden rounded-[26px] border border-white/70 bg-white/50 backdrop-blur-xl p-6 shadow-[0_10px_24px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.85)]">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <input
          type="file"
          accept="text/html,.html"
          onChange={handleFileSelect}
          className="text-sm text-[#5A6269] file:mr-4 file:rounded-xl file:border file:border-white/70 file:bg-white/50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#0d1619] hover:file:bg-white/70 backdrop-blur-xl"
        />
        <Button
          type="button"
          variant="secondary"
          className="h-9 px-4"
          onClick={() => setRaw("")}
        >
          Clear
        </Button>
      </div>

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        className="min-h-[360px] w-full rounded-2xl border border-white/70 bg-white/50 p-4 font-mono text-sm text-[#0d1619] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] outline-none transition-all placeholder:text-[#A0A8B0] focus:border-[#037aff] focus:bg-white/60 focus:ring-4 focus:ring-[#037aff]/10 backdrop-blur-xl"
        placeholder="<!DOCTYPE html>&#10;<html>&#10;  <head>&#10;    <title>Example Article Title</title>&#10;    <meta name=&quot;description&quot; content=&quot;Short excerpt for the article&quot; />&#10;    <meta name=&quot;category&quot; content=&quot;bookkeeping-accounting&quot; />&#10;  </head>&#10;  <body>&#10;    <article>&#10;      <h1>Article Heading</h1>&#10;      <p>Article content goes here...</p>&#10;    </article>&#10;  </body>&#10;</html>"
      />

        <div className="flex items-center justify-between text-sm">
          <span className={parsed.ok ? "text-[#5A6269]" : "text-red-500"}>
            {parsed.ok ? `HTML ready to import` : "Paste HTML or upload a file"}
          </span>
          <Button type="button" disabled={!parsed.ok || loading} className="h-[42px]">
            {loading ? "Importing..." : "Confirm Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}

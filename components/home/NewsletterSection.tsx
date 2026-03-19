"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setStatus("error");
        toast.error(payload.error || "Subscription failed.");
        return;
      }

      setStatus("success");
      setEmail("");
      toast.success("You’re subscribed to new articles.");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      toast.error("Unable to subscribe right now.");
    }
  };

  return (
    <section className="w-full bg-[#F0EFEB] py-20">
      <div className="max-w-lg mx-auto px-6 text-center">
        <h2 className="font-display font-bold text-3xl text-[#0d1619]">
          Get new articles by email
        </h2>
        <p className="text-[#5A6269] mt-3">
          One email when we publish. No spam, no sales pitches. Unsubscribe anytime.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-8">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading" || status === "success"}
            className="flex-grow bg-white rounded-xl border border-[#E2DFD8] px-4 py-3 text-[#0d1619] placeholder:text-[#A0A8B0] focus:outline-none focus:ring-2 focus:ring-[#037aff]/20 focus:border-[#037aff] transition-all disabled:opacity-50"
          />
          <Button 
            type="submit" 
            disabled={status === "loading" || status === "success"}
            className="bg-[#037aff] hover:bg-[#0260CC] text-white rounded-xl px-6 py-6 font-medium transition-colors sm:w-auto w-full"
          >
            {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}

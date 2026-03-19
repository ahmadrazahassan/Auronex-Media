"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";

export function FinalCTA() {
  const topicsHref = `/${CATEGORIES[0]?.slug ?? "bookkeeping-accounting"}`;

  return (
    <section className="w-full bg-[#FAF9F6] py-20 text-center">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display font-bold text-3xl text-[#0d1619]">
          Looking for a specific topic?
        </h2>
        <p className="text-[#5A6269] mt-3">
          Browse by category or explore our complete archive.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href={topicsHref} className={cn(buttonVariants(), "bg-[#037aff] hover:bg-[#0260CC] text-white rounded-xl px-6 py-6 font-medium")}>
            Browse Topics
          </Link>
          <Link href={topicsHref} className={cn(buttonVariants({ variant: "outline" }), "bg-transparent border-[#E2DFD8] text-[#0d1619] hover:bg-[#F0EFEB] rounded-xl px-6 py-6 font-medium")}>
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}

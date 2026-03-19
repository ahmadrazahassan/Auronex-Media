import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { RecentlyPublished } from "@/components/home/RecentlyPublished";
import { CategoryArticles } from "@/components/home/CategoryArticles";
import { ValueProposition } from "@/components/home/ValueProposition";
import { TrustedTopics } from "@/components/home/TrustedTopics";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <HeroSection />
        <RecentlyPublished />
      </div>
      
      <CategoryArticles />
      <ValueProposition />
      <TrustedTopics />
      <NewsletterSection />
      <FinalCTA />
    </div>
  );
}

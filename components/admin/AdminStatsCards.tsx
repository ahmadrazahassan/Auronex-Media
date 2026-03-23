import type { DashboardStats } from "@/types";

export function AdminStatsCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: "Published", value: stats.publishedCount, hint: `${stats.totalViews.toLocaleString()} total views` },
    { label: "Drafts", value: stats.draftCount, hint: "Ready for editorial review" },
    { label: "Categories", value: stats.categoryCount, hint: "Coverage across the newsroom" },
    { label: "Subscribers", value: stats.subscriberCount, hint: "Newsletter audience" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-[26px] border border-[#E2DFD8] bg-white p-6 shadow-[0_10px_24px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A838B]">{card.label}</p>
          <p className="mt-4 font-display text-4xl font-bold text-[#0d1619]">{card.value}</p>
          <p className="mt-3 text-sm font-medium text-[#5A6269]">{card.hint}</p>
        </div>
      ))}
    </div>
  );
}

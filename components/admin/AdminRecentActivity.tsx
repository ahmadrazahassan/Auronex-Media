import { formatDate } from "@/lib/utils";
import type { ArticleWithCategory, Subscriber } from "@/types";

interface AdminRecentActivityProps {
  articles: ArticleWithCategory[];
  subscribers: Subscriber[];
}

export function AdminRecentActivity({ articles, subscribers }: AdminRecentActivityProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="rounded-[26px] border border-white/70 bg-white/50 backdrop-blur-xl p-6 shadow-[0_10px_24px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.85)]">
        <h3 className="font-display font-bold text-lg text-[#0d1619] mb-5">Recent Articles</h3>
        <div className="flex flex-col gap-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex justify-between items-start rounded-2xl border border-white/70 bg-white/50 backdrop-blur-xl px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
            >
              <div>
                <p className="text-sm font-medium text-[#0d1619] line-clamp-1">{article.title}</p>
                <p className="text-xs text-[#5A6269] mt-1">{article.author_name || "Editorial Team"}</p>
              </div>
              <span className="text-xs bg-white/50 text-[#037aff] px-2.5 py-1 rounded-full font-medium whitespace-nowrap border border-white/70 backdrop-blur-xl">
                {article.category?.name || "Uncategorised"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[26px] border border-white/70 bg-white/50 backdrop-blur-xl p-6 shadow-[0_10px_24px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.85)]">
        <h3 className="font-display font-bold text-lg text-[#0d1619] mb-5">Recent Subscribers</h3>
        <div className="flex flex-col gap-4">
          {subscribers.map((subscriber) => (
            <div
              key={subscriber.id}
              className="flex justify-between items-center rounded-2xl border border-white/70 bg-white/50 backdrop-blur-xl px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
            >
              <p className="text-sm font-medium text-[#0d1619]">{subscriber.email}</p>
              <span className="text-xs text-[#5A6269]">{formatDate(subscriber.created_at)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

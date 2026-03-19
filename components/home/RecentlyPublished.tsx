import Link from "next/link";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { getFeaturedArticles, getLatestArticles } from "@/lib/queries";

export async function RecentlyPublished() {
  const featuredArticles = await getFeaturedArticles();
  const recentArticles = await getLatestArticles(10, featuredArticles.map((article) => article.id));
  const mediumCards = recentArticles.slice(0, 2);
  const smallCards = recentArticles.slice(2, 10);
  const viewAllHref = `/${recentArticles[0]?.category?.slug ?? "bookkeeping-accounting"}`;

  return (
    <section className="py-20">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.15em] text-[#037aff] font-semibold block mb-2">
            Recently Published
          </span>
          <h2 className="font-display font-bold text-3xl text-[#0d1619]">
            Fresh off the press
          </h2>
        </div>
        <Link href={viewAllHref} className="text-sm font-medium text-[#037aff] hover:underline">
          View all articles →
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Row: 2 Medium Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mediumCards.map((article) => (
            <ArticleCard key={article.id} article={article} variant="medium" />
          ))}
        </div>

        {/* Bottom Rows: 8 Small Cards (or however many are left) */}
        {smallCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {smallCards.map((article) => (
              <ArticleCard key={article.id} article={article} variant="small" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

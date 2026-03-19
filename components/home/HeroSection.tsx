import { ArticleCardLarge } from "@/components/articles/ArticleCardLarge";
import { getFeaturedArticles } from "@/lib/queries";

export async function HeroSection() {
  const featuredArticles = await getFeaturedArticles();

  return (
    <section className="mt-16 md:mt-24">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-2 mb-4 text-[#037aff] text-xs font-semibold tracking-[0.2em] uppercase">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            <path d="M8 7h6" />
            <path d="M8 11h4" />
          </svg>
          AURONEX MEDIA
        </div>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#0d1619] leading-tight mt-4 max-w-4xl mx-auto">
          Business Finance, Covered.
        </h1>
        <p className="text-lg text-[#5A6269] max-w-2xl mx-auto mt-5">
          In-depth articles on accounting, payroll, tax, invoicing, and compliance — built for UK business owners who need real answers, not jargon.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featuredArticles.map((article) => (
          <ArticleCardLarge key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

import { notFound } from "next/navigation";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { getArticleByCategoryAndSlug, getRelatedArticles } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { category: categorySlug, slug } = resolvedParams;

  const article = await getArticleByCategoryAndSlug(categorySlug, slug);
  if (!article) {
    notFound();
  }

  const relatedArticles = article.category_id
    ? await getRelatedArticles(article.category_id, article.id, 3)
    : [];

  const safeHtml = DOMPurify.sanitize(article.content);
  const category = article.category ?? { name: "Uncategorised", slug: categorySlug };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <header className="py-12">
          <CategoryPill name={category.name} slug={category.slug} />
          
          <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-tight mt-4 text-[#0d1619]">
            {article.title}
          </h1>
          
          <div className="mt-5 flex items-center flex-wrap gap-2 text-sm text-[#5A6269]">
            <span className="font-medium text-[#0d1619]">{article.author_name || "Editorial Team"}</span>
            {article.published_at ? (
              <>
                <span className="text-[#A0A8B0]">·</span>
                <span>{formatDate(article.published_at)}</span>
              </>
            ) : null}
          </div>

          <div className="relative w-full aspect-video mt-8 rounded-2xl overflow-hidden border border-[#E2DFD8]">
            <Image 
              src={article.thumbnail_url || "/og-default.png"} 
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </header>

        {/* Article Body */}
        <article 
          className="article-content pb-12"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
        
        {/* Separator */}
        <hr className="border-[#E2DFD8] my-12" />

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mb-20">
            <h2 className="font-display font-bold text-2xl text-[#0d1619] mb-6">
              Related articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedArticles.map(relArticle => (
                <ArticleCard key={relArticle.id} article={relArticle} variant="small" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}

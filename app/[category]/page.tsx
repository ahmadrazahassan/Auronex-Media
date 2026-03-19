import { notFound } from "next/navigation";
import { getArticlesByCategorySlug } from "@/lib/queries";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Auronex Media - The Modern Editorial System",
  description: "A fast, beautiful, and complete editorial system for modern publishing.",
  openGraph: {
    title: "Auronex Media - The Modern Editorial System",
    description: "A fast, beautiful, and complete editorial system for modern publishing.",
    type: "website",
  },
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;

  const { category, articles } = await getArticlesByCategorySlug(categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <header className="py-12">
          <span className="text-xs uppercase tracking-wide text-[#037aff] font-semibold">
            SMALLBIZ DESK / {category.name.toUpperCase()}
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl mt-3 text-[#0d1619]">
            {category.name}
          </h1>
          <p className="text-lg text-[#5A6269] mt-3 max-w-2xl">
            {category.description}
          </p>
        </header>

        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} variant="medium" />
              ))}
            </div>
            
            <div className="mt-16 flex justify-center">
              <Button variant="outline" className="bg-transparent border-[#E2DFD8] text-[#0d1619] hover:bg-[#F0EFEB] rounded-xl px-8 py-6 font-medium">
                Load more
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-10 py-20 text-center border border-dashed border-[#E2DFD8] rounded-2xl bg-white">
            <p className="text-[#0d1619] font-medium">No published articles yet</p>
            <p className="text-[#5A6269] mt-2 text-sm">Check back soon — our editorial team is updating this section.</p>
          </div>
        )}
      </div>
    </div>
  );
}

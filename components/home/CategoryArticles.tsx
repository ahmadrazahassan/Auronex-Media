import Link from "next/link";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { getHomepageCategorySections } from "@/lib/queries";

export async function CategoryArticles() {
  const sections = await getHomepageCategorySections();

  return (
    <div className="flex flex-col">
      {sections.map(({ category, articles: categoryArticles }, index) => {
        const isEven = index % 2 === 0;
        
        return (
          <section 
            key={category.slug} 
            className={`w-full py-16 ${isEven ? 'bg-[#FAF9F6]' : 'bg-[#F0EFEB]'}`}
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
                <div>
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-[#0d1619]">
                    {category.name}
                  </h2>
                  <p className="text-sm text-[#5A6269] mt-1 max-w-2xl">
                    {category.description}
                  </p>
                </div>
                <Link 
                  href={`/${category.slug}`} 
                  className="text-sm font-medium text-[#037aff] hover:underline whitespace-nowrap"
                >
                  See all in {category.name} →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {categoryArticles.slice(0, 4).map((article) => (
                  <ArticleCard key={article.id} article={article} variant="small" />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

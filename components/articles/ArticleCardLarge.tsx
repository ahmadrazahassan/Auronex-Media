import Link from "next/link";
import Image from "next/image";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { formatDate } from "@/lib/utils";

interface ArticleCardLargeProps {
  article: {
    title: string;
    slug: string;
    excerpt?: string | null;
    thumbnail_url?: string | null;
    category: { name: string; slug: string } | null;
    author_name?: string | null;
    published_at?: string | null;
  };
}

export function ArticleCardLarge({ article }: ArticleCardLargeProps) {
  const category = article.category ?? { name: "Uncategorised", slug: "bookkeeping-accounting" };

  return (
    <article className="bg-white rounded-2xl border border-[#E2DFD8] overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group">
      <Link href={`/${category.slug}/${article.slug}`} className="block relative w-full aspect-[16/10] overflow-hidden">
        <Image 
          src={article.thumbnail_url || "/og-default.png"} 
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          // Hero section uses 2 columns on large screens; ask for a full-quality width.
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
          quality={100}
          priority
          loading="eager"
        />
      </Link>
      <div className="p-6 lg:p-8 flex flex-col flex-grow">
        <div className="mb-3">
          <CategoryPill name={category.name} slug={category.slug} />
        </div>
        <Link href={`/${category.slug}/${article.slug}`} className="group-hover:text-[#037aff] transition-colors">
          <h2 className="font-display font-bold text-xl lg:text-2xl text-[#0d1619] line-clamp-2">
            {article.title}
          </h2>
        </Link>
        {article.excerpt ? (
          <p className="text-sm text-[#5A6269] mt-2 line-clamp-2 flex-grow">
            {article.excerpt}
          </p>
        ) : <div className="flex-grow" />}
        <div className="mt-5 flex justify-between items-center pt-4 border-t border-[#E2DFD8]/50">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-[#0d1619]">{article.author_name || "Editorial Team"}</span>
            {article.published_at ? (
              <>
                <span className="text-[#A0A8B0]">·</span>
                <span className="text-[#5A6269]">{formatDate(article.published_at)}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

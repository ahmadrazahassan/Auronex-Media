import Link from "next/link";
import Image from "next/image";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  article: {
    title: string;
    slug: string;
    excerpt?: string | null;
    thumbnail_url?: string | null;
    category: { name: string; slug: string } | null;
    author_name?: string | null;
    published_at?: string | null;
    read_time?: number | null;
  };
  variant?: "medium" | "small";
}

export function ArticleCard({ article, variant = "small" }: ArticleCardProps) {
  const isMedium = variant === "medium";
  const category = article.category ?? { name: "Uncategorised", slug: "bookkeeping-accounting" };

  return (
    <article className="bg-white rounded-2xl border border-[#E2DFD8] overflow-hidden hover:shadow-md hover:border-[#037aff]/30 transition-all duration-300 flex flex-col h-full group">
      <Link href={`/${category.slug}/${article.slug}`} className={`block relative w-full overflow-hidden ${isMedium ? 'aspect-video' : 'aspect-[4/3]'}`}>
        <Image 
          src={article.thumbnail_url || "/og-default.png"} 
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </Link>
      <div className={`flex flex-col flex-grow ${isMedium ? 'p-5' : 'p-4'}`}>
        <div className="mb-2">
          <CategoryPill name={category.name} slug={category.slug} />
        </div>
        <Link href={`/${category.slug}/${article.slug}`} className="group-hover:text-[#037aff] transition-colors">
          <h3 className={`font-display font-semibold text-[#0d1619] line-clamp-2 ${isMedium ? 'text-lg' : 'text-base'}`}>
            {article.title}
          </h3>
        </Link>
        {isMedium && article.excerpt && (
          <p className="text-sm text-[#5A6269] mt-2 line-clamp-2 flex-grow">
            {article.excerpt}
          </p>
        )}
        <div className={`mt-3 flex items-center text-xs text-[#5A6269] ${!isMedium && !article.excerpt ? 'mt-auto pt-3' : 'pt-3'}`}>
          {isMedium && article.author_name && article.published_at ? (
            <>
              <span className="font-medium text-[#0d1619]">{article.author_name}</span>
              <span className="mx-1.5 text-[#A0A8B0]">·</span>
              <span>{formatDate(article.published_at)}</span>
            </>
          ) : article.published_at ? (
            <span>{formatDate(article.published_at)}</span>
          ) : (
            <span>Draft</span>
          )}
        </div>
      </div>
    </article>
  );
}

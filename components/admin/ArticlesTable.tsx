import Link from "next/link";
import { Edit, Eye } from "lucide-react";
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton";
import { formatDate } from "@/lib/utils";
import type { ArticleWithCategory } from "@/types";

export function ArticlesTable({ articles }: { articles: ArticleWithCategory[] }) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-white/70 bg-white/50 backdrop-blur-xl shadow-[0_10px_24px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.85)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
              <tr className="border-b border-white/70 bg-white/60 backdrop-blur-xl">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A838B]">Title</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A838B]">Category</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A838B]">Status</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A838B]">Date</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[#7A838B]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/70">
            {articles.map((article) => (
              <tr key={article.id} className="transition-colors hover:bg-white/45">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-[#0d1619] line-clamp-1">{article.title}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full border border-white/70 bg-white/50 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#037aff] backdrop-blur-xl">
                    {article.category?.name || "Uncategorised"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      article.status === "published"
                        ? "border border-[#D7EEDA] bg-white/50 text-[#2D7A39]"
                        : "border border-[#F1E0BD] bg-white/50 text-[#9A6B15]"
                    } backdrop-blur-xl`}
                  >
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#5A6269] whitespace-nowrap">
                  {article.published_at ? formatDate(article.published_at) : "—"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/${article.category?.slug || "bookkeeping-accounting"}/${article.slug}`} target="_blank" className="p-2 text-[#5A6269] hover:text-[#037aff] hover:bg-white/60 rounded-lg transition-colors backdrop-blur-xl">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/admin/articles/${article.id}`} className="p-2 text-[#5A6269] hover:text-[#037aff] hover:bg-white/60 rounded-lg transition-colors backdrop-blur-xl">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <DeleteArticleButton articleId={article.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between border-t border-white/70 bg-white/55 backdrop-blur-xl px-6 py-4 text-sm text-[#5A6269]">
        <span>Showing 1 to {articles.length} of {articles.length} entries</span>
        <div className="flex gap-1">
          <button className="rounded-xl border border-white/70 bg-white/50 backdrop-blur-xl px-3 py-1.5 disabled:opacity-50" disabled>Prev</button>
          <button className="rounded-xl border border-white/70 bg-white/50 backdrop-blur-xl px-3 py-1.5 disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}

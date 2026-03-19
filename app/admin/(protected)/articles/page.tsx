import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { ArticlesTable } from "@/components/admin/ArticlesTable";
import { getAdminArticles } from "@/lib/queries";

export default async function AdminArticlesPage() {
  const articles = await getAdminArticles();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#0d1619]">Articles</h1>
          <p className="mt-2 text-sm text-[#5A6269]">Manage all your editorial content here.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/articles/bulk-upload" className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[14px] border border-[#D9D4CB] bg-white px-5 text-[15px] font-medium text-[#0d1619] shadow-[0_1px_2px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all hover:border-[#CFC8BD] hover:bg-[#FDFCFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#037aff]/20 active:translate-y-[1px]">
            <Upload className="w-4 h-4" />
            Bulk Upload
          </Link>
          <Link href="/admin/articles/new" className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[14px] bg-[#037aff] px-5 text-[15px] font-medium text-white shadow-[0_4px_14px_rgba(3,122,255,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all hover:bg-[#0266D6] hover:shadow-[0_6px_20px_rgba(3,122,255,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#037aff]/20 active:translate-y-[1px]">
            <Plus className="w-4 h-4" />
            New Article
          </Link>
        </div>
      </div>

      <ArticlesTable articles={articles} />
    </div>
  );
}

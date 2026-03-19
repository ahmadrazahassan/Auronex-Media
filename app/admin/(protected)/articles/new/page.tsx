import { ArticleForm } from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-[#5A6269] mb-2">
        <a href="/admin/articles" className="hover:text-[#0d1619]">Articles</a>
        <span>/</span>
        <span className="text-[#0d1619] font-medium">New Article</span>
      </div>
      <ArticleForm />
    </div>
  );
}
